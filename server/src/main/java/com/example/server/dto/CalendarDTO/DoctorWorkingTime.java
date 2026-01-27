package com.example.server.dto.CalendarDTO;

import java.time.LocalTime;

public record DoctorWorkingTime(
        LocalTime start,
        LocalTime end
) {}
