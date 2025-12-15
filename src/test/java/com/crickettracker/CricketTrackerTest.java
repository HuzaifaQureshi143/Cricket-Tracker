package com.crickettracker;

import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class CricketTrackerTest {

    @Test
    public void sampleTest() {
        int expected = 5;
        int actual = 2 + 3;
        assertEquals("Sum should be 5", expected, actual);
    }
}
