class HOSCalculator:
    def __init__(self, current_cycle_used=0.0):
        self.current_status = 'off_duty'
        self.drive_time_today = 0.0
        self.on_duty_time_today = 0.0
        self.time_since_last_break = 0.0 # Tracks time for the 8-hour rule
        self.total_cycle_time = current_cycle_used
        self.miles_since_last_fuel = 0.0
        self.day_count = 1
        self.events = [] # List of dicts: {'day': 1, 'status': '...', 'duration': hrs, 'label': '...'}

    def add_event(self, status, duration, label):
        self.events.append({
            'day': self.day_count,
            'status': status,
            'duration': duration,
            'label': label
        })
        
        self.total_cycle_time += duration
        
        if status == 'driving':
            self.drive_time_today += duration
            self.on_duty_time_today += duration
            self.time_since_last_break += duration
        elif status == 'on_duty':
            self.on_duty_time_today += duration
            self.time_since_last_break += duration
        elif status == 'off_duty':
            if duration >= 0.5:
                self.time_since_last_break = 0.0 # 30 min break resets 8-hour clock
            if duration >= 10:
                self.reset_daily()

    def reset_daily(self):
        self.drive_time_today = 0.0
        self.on_duty_time_today = 0.0
        self.time_since_last_break = 0.0
        self.day_count += 1

    def process_trip(self, total_distance, total_duration):
        # Step 1: Pickup
        self.add_event('on_duty', 1.0, 'Pickup')
        
        # Calculate average speed to convert chunks
        if total_duration > 0:
            avg_speed = total_distance / total_duration
        else:
            avg_speed = 60.0
            
        remaining_distance = total_distance
        
        # Step 2: Driving
        while remaining_distance > 0:
            # Check if we need fuel first (let's say 1000 miles is the limit)
            miles_to_fuel = 1000.0 - self.miles_since_last_fuel
            
            # Check 8-hour rule
            drive_to_break = 8.0 - self.time_since_last_break
            
            # Check 11-hour rule
            drive_to_11 = 11.0 - self.drive_time_today
            
            # Check 14-hour rule
            drive_to_14 = 14.0 - self.on_duty_time_today
            
            drive_limit_hrs = min(drive_to_break, drive_to_11, drive_to_14)
            drive_limit_miles = drive_limit_hrs * avg_speed
            
            # What happens first?
            chunk_distance = min(remaining_distance, drive_limit_miles, miles_to_fuel)
            chunk_duration = chunk_distance / avg_speed if avg_speed > 0 else 0
            
            if chunk_distance > 0:
                self.add_event('driving', chunk_duration, 'Driving')
                remaining_distance -= chunk_distance
                self.miles_since_last_fuel += chunk_distance
            
            # Resolve the limits
            if self.miles_since_last_fuel >= 1000.0:
                self.add_event('on_duty', 0.5, 'Fuel Stop')
                self.miles_since_last_fuel = 0.0
            elif self.drive_time_today >= 11.0 or self.on_duty_time_today >= 14.0:
                self.add_event('off_duty', 10.0, '10-Hour Rest (Sleeper Berth)')
            elif self.time_since_last_break >= 8.0:
                self.add_event('off_duty', 0.5, '30-Minute Break')
        
        # Step 3: Dropoff
        self.add_event('on_duty', 1.0, 'Dropoff')
        
        return self.events
