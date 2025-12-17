package com.crickettracker.crickettracker.model;

import java.time.LocalDate;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Unit tests for Match class.
 */
public class MatchTest {

    /**
     * Test 1: Verify Match creation with default constructor and setters.
     */
    @Test
    public void testMatchCreation() {
        Match match = new Match();
        assertNotNull(match);
        match.setId("101");
        assertEquals("101", match.getId());
    }

    /**
     * Test 2: Verify Match initialization with parameterized constructor.
     */
    @Test
    public void testMatchParameterizedConstructor() {
        LocalDate date = LocalDate.of(2023, 12, 25);
        Match match = new Match("1", date, "Opponent A", 45, 30, 1, 5.0, 20, 0);
        
        assertEquals("Opponent A", match.getOpponent());
        assertEquals(Integer.valueOf(45), match.getRunsScored());
        assertEquals(date, match.getMatchDate());
    }

    /**
     * Test 3: Verify Batting Statistics.
     */
    @Test
    public void testBattingStats() {
        Match match = new Match();
        match.setRunsScored(100);
        match.setBallsFaced(60);
        
        assertEquals(Integer.valueOf(100), match.getRunsScored());
        assertEquals(Integer.valueOf(60), match.getBallsFaced());
    }

    /**
     * Test 4: Verify Bowling Statistics.
     */
    @Test
    public void testBowlingStats() {
        Match match = new Match();
        match.setWicketsTaken(3);
        match.setOversBowled(4.0);
        match.setRunsConceded(25);
        
        assertEquals(Integer.valueOf(3), match.getWicketsTaken());
        assertEquals(Double.valueOf(4.0), match.getOversBowled());
        assertEquals(Integer.valueOf(25), match.getRunsConceded());
    }

    /**
     * Test 5: Verify Fielding Statistics (Catches).
     */
    @Test
    public void testFieldingStats() {
        Match match = new Match();
        match.setCatches(2);
        
        assertEquals(Integer.valueOf(2), match.getCatches());
        
        // Update value
        match.setCatches(3);
        assertEquals(Integer.valueOf(3), match.getCatches());
    }
}
