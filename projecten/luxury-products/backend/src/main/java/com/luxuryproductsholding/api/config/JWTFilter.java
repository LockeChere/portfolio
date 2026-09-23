package com.luxuryproductsholding.api.config;

import com.auth0.jwt.exceptions.JWTVerificationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    public JWTFilter(JWTUtil jwtTokenUtil, UserDetailsService userDetailsService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();
        
        System.out.println("JWTFilter: Processing request to " + requestURI);
        System.out.println("JWTFilter: Authorization header present: " + (authHeader != null));

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                String email = jwtTokenUtil.validateTokenAndRetrieveSubject(jwt);
                System.out.println("JWTFilter: Valid token for email: " + email);
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                System.out.println("JWTFilter: UserDetails loaded - Username: " + userDetails.getUsername());
                System.out.println("JWTFilter: UserDetails authorities: " + userDetails.getAuthorities());
                
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authToken);
                
                System.out.println("JWTFilter: Authentication set in SecurityContext");
                System.out.println("JWTFilter: Current authentication authorities: " + 
                    SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                
            } catch (JWTVerificationException exc) {
                System.out.println("JWTFilter: Token verification failed: " + exc.getMessage());
            } catch (Exception exc) {
                System.out.println("JWTFilter: Unexpected error: " + exc.getMessage());
                exc.printStackTrace();
            }
        } else {
            System.out.println("JWTFilter: No valid Authorization header found");
        }

        filterChain.doFilter(request, response);
    }
}
