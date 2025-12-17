package com.crickettracker.crickettracker.model;

import java.time.LocalDate;

/**
 * Model class representing a Cricket Match.
 * This class serves as the 'Model' in the MVC architecture.
 */
public class Match {
    
    private String id;
    private LocalDate matchDate;
    private String opponent;
    
    // Batting stats
    private Integer runsScored;
    private Integer ballsFaced;
    
    // Bowling stats
    private Integer wicketsTaken;
    private Double oversBowled;
    private Integer runsConceded;
    private Integer catches;

    public Match() {
    }

    public Match(String id, LocalDate matchDate, String opponent, Integer runsScored, Integer ballsFaced, Integer wicketsTaken, Double oversBowled, Integer runsConceded, Integer catches) {
        this.id = id;
        this.matchDate = matchDate;
        this.opponent = opponent;
        this.runsScored = runsScored;
        this.ballsFaced = ballsFaced;
        this.wicketsTaken = wicketsTaken;
        this.oversBowled = oversBowled;
        this.runsConceded = runsConceded;
        this.catches = catches;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDate getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDate matchDate) {
        this.matchDate = matchDate;
    }

    public String getOpponent() {
        return opponent;
    }

    public void setOpponent(String opponent) {
        this.opponent = opponent;
    }

    public Integer getRunsScored() {
        return runsScored;
    }

    public void setRunsScored(Integer runsScored) {
        this.runsScored = runsScored;
    }

    public Integer getBallsFaced() {
        return ballsFaced;
    }

    public void setBallsFaced(Integer ballsFaced) {
        this.ballsFaced = ballsFaced;
    }

    public Integer getWicketsTaken() {
        return wicketsTaken;
    }

    public void setWicketsTaken(Integer wicketsTaken) {
        this.wicketsTaken = wicketsTaken;
    }

    public Double getOversBowled() {
        return oversBowled;
    }

    public void setOversBowled(Double oversBowled) {
        this.oversBowled = oversBowled;
    }

    public Integer getRunsConceded() {
        return runsConceded;
    }

    public void setRunsConceded(Integer runsConceded) {
        this.runsConceded = runsConceded;
    }

    public Integer getCatches() {
        return catches;
    }

    public void setCatches(Integer catches) {
        this.catches = catches;
    }
}
