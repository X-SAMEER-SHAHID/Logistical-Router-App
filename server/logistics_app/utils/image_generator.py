from PIL import Image, ImageDraw, ImageFont
import os
from django.conf import settings
from datetime import datetime

def generate_log_sheet(day_number, events, route_plan_id):
    """
    Generates a realistic DOT log sheet image matching the requested design:
    blue grid, black tracking line, red nodes, and remark brackets.
    """
    width, height = 1200, 600
    image = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(image)
    
    # Try to load a standard font
    try:
        font_title = ImageFont.truetype("Arial", 36)
        font_bold = ImageFont.truetype("Arial Bold", 18)
        font_normal = ImageFont.truetype("Arial", 16)
        font_small = ImageFont.truetype("Arial", 12)
        font_tiny = ImageFont.truetype("Arial", 10)
    except IOError:
        font_title = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_normal = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_tiny = ImageFont.load_default()

    # Colors matching the reference design
    grid_color = '#5271C2' # A nice blueprint blue
    line_color = 'black'
    node_color = 'red'

    # -- GRID SECTION --
    grid_x = 180
    grid_y = 80
    grid_w = 950
    grid_h = 240
    row_h = grid_h // 4
    
    # Hours Text
    hours_labels = ["Midnight", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "Noon", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "Midnight"]
    for i, label in enumerate(hours_labels):
        x = grid_x + i * (grid_w / 24.0)
        text_y = grid_y - 25
        # Center "Midnight" slightly
        if "Midnight" in label:
            draw.text((x - 20, text_y), label, fill=grid_color, font=font_small)
            draw.text((x - 20, grid_y + grid_h + 5), label, fill=grid_color, font=font_small)
        else:
            draw.text((x - 5, text_y), label, fill=grid_color, font=font_small)
            draw.text((x - 5, grid_y + grid_h + 5), label, fill=grid_color, font=font_small)
        
    draw.text((grid_x + grid_w + 15, grid_y - 25), "Total\nHours", fill=grid_color, font=font_small)
    
    # Status Labels
    draw.text((20, grid_y + 0 * row_h + 15), "1: OFF DUTY", fill=grid_color, font=font_bold)
    draw.text((20, grid_y + 1 * row_h + 5), "2: SLEEPER\n   BERTH", fill=grid_color, font=font_bold)
    draw.text((20, grid_y + 2 * row_h + 15), "3: DRIVING", fill=grid_color, font=font_bold)
    draw.text((20, grid_y + 3 * row_h + 5), "4: ON DUTY\n   (NOT DRIVING)", fill=grid_color, font=font_bold)

    # Draw Horizontal Lines for Grid
    for i in range(5):
        y = grid_y + i * row_h
        draw.line([(grid_x, y), (grid_x + grid_w, y)], fill=grid_color, width=2)

    # Draw Vertical Tick Marks
    for h in range(25):
        x = grid_x + h * (grid_w / 24.0)
        # Main hour line
        draw.line([(x, grid_y), (x, grid_y + grid_h)], fill=grid_color, width=1 if h != 0 and h != 24 else 2)
        
        # Bottom main ticks for remarks
        draw.line([(x, grid_y + grid_h), (x, grid_y + grid_h + 15)], fill=grid_color, width=2)
        
        # Quarter hour ticks
        if h < 24:
            for q in range(1, 4):
                qx = x + q * (grid_w / 96.0)
                # Middle tick is longer
                tick_len = row_h // 2 if q == 2 else row_h // 4
                
                # Bottom remark ticks
                draw.line([(qx, grid_y + grid_h), (qx, grid_y + grid_h + (10 if q==2 else 5))], fill=grid_color, width=1)
                
                # Draw ticks across all rows
                for r in range(4):
                    ry = grid_y + r * row_h
                    # Tick points down from the line
                    draw.line([(qx, ry), (qx, ry + tick_len)], fill=grid_color, width=1)
                    # And up from the line below it
                    if r < 3:
                        draw.line([(qx, ry + row_h), (qx, ry + row_h - tick_len)], fill=grid_color, width=1)
                    else:
                        draw.line([(qx, grid_y + grid_h), (qx, grid_y + grid_h - tick_len)], fill=grid_color, width=1)

    # -- DRAW HOS EVENT LINES AND REMARKS --
    statuses = ['off_duty', 'sleeper_berth', 'driving', 'on_duty']
    
    current_time_hrs = 0.0
    prev_x = None
    prev_y = None
    
    draw.text((20, grid_y + grid_h + 40), "REMARKS", fill=grid_color, font=font_title)
    
    for event in events:
        if event['day'] != day_number:
            continue
            
        status = event['status']
        if status not in statuses:
            if status == '10-Hour Rest (Sleeper Berth)':
                status = 'sleeper_berth'
            else:
                status = 'off_duty' if 'off' in status else 'on_duty'
                
        duration = event['duration']
        end_time_hrs = current_time_hrs + duration
        if current_time_hrs >= 24.0:
            break
        actual_end = min(24.0, end_time_hrs)
        
        # Determine Row Y Coordinate
        row_idx = statuses.index(status) if status in statuses else 0
        if status == '10-Hour Rest (Sleeper Berth)': row_idx = 1
        elif status == 'off_duty': row_idx = 0
        elif status == 'driving': row_idx = 2
        elif status == 'on_duty': row_idx = 3
            
        y = grid_y + row_idx * row_h
        x1 = grid_x + (current_time_hrs / 24.0) * grid_w
        x2 = grid_x + (actual_end / 24.0) * grid_w
        
        # Draw vertical connecting line if changing status
        if prev_x is not None and prev_y is not None and prev_y != y:
            draw.line([(prev_x, prev_y), (x1, y)], fill=line_color, width=5)
            # Draw red node at the corner
            radius = 5
            draw.ellipse([(x1 - radius, prev_y - radius), (x1 + radius, prev_y + radius)], fill=node_color)
            draw.ellipse([(x1 - radius, y - radius), (x1 + radius, y + radius)], fill=node_color)
        elif prev_x is None:
            # First node
            radius = 5
            draw.ellipse([(x1 - radius, y - radius), (x1 + radius, y + radius)], fill=node_color)
            
        # Draw horizontal segment
        draw.line([(x1, y), (x2, y)], fill=line_color, width=6)
        
        # End node
        radius = 5
        draw.ellipse([(x2 - radius, y - radius), (x2 + radius, y + radius)], fill=node_color)
        
        # Draw Remark bracket below grid if it's an important event (Pickup, Dropoff, Stop)
        # To avoid clutter, only label non-driving events, or specifically Pickup/Dropoff/Fuel
        if event['label'] != 'Driving':
            # Draw a bracket from x1 to x2 (or just at x1)
            rem_y = grid_y + grid_h + 30
            # Draw a line down
            draw.line([(x1, grid_y + grid_h + 15), (x1, rem_y)], fill='black', width=3)
            # Draw text diagonally or vertically
            # PIL doesn't support diagonal text natively without creating a rotated image
            # So we will draw a rotated image for the text
            text_img = Image.new('RGBA', (200, 30), (255, 255, 255, 0))
            text_draw = ImageDraw.Draw(text_img)
            text_draw.text((0, 0), event['label'], fill='black', font=font_bold)
            rotated_text = text_img.rotate(45, expand=1)
            
            # Paste it onto the main image
            image.paste(rotated_text, (int(x1) - 10, rem_y), rotated_text)
        
        prev_x = x2
        prev_y = y
        current_time_hrs = end_time_hrs
        
    # Save image
    media_dir = os.path.join(settings.MEDIA_ROOT, 'log_sheets')
    os.makedirs(media_dir, exist_ok=True)
    filename = f"log_sheet_route_{route_plan_id}_day_{day_number}_{int(datetime.now().timestamp())}.png"
    filepath = os.path.join(media_dir, filename)
    image.save(filepath)
    
    return f"log_sheets/{filename}"
