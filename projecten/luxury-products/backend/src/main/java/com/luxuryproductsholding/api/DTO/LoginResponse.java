package com.luxuryproductsholding.api.DTO;

public class LoginResponse {
    public String userId;
    public String email;
    public String token;
    public String role;

    public LoginResponse(Long userId, String email, String token, String role) {
        this.userId = String.valueOf(userId);
        this.email = email;
        this.token = token;
        this.role = role;
    }
}
