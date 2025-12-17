package com.crickettracker.crickettracker.controller;

import com.crickettracker.crickettracker.model.Match;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Controller class for handling Match-related requests.
 * This class serves as the 'Controller' in the MVC architecture.
 */
@Path("matches")
public class MatchController {

    // Simulating a service call or database lookup
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllMatches() {
        // This is a dummy implementation to demonstrate MVC structure
        // In a full Java MVC app, this would call a Service layer
        List<Match> matches = new ArrayList<>();
        matches.add(new Match("1", LocalDate.now(), "Dummy Opponent", 50, 40, 2, 4.0, 30, 1));
        
        return Response.ok(matches).build();
    }
}
