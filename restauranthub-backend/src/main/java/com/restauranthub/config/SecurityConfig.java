package com.restauranthub.config;

import com.restauranthub.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // CSRF
                .csrf(csrf -> csrf.disable())

                // CORS
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource())
                )

                // Stateless Session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Authorization
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        // Payment HTML Page

                        .requestMatchers("/payment.html")
                        .permitAll()


                        // Public APIs

                        .requestMatchers(
                                "/api/auth/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        )
                        .permitAll()

                        // Public Get APIs

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories/**",
                                "/api/foods/**"
                        )
                        .permitAll()


                        // =====================================
                        // PUBLIC FOOD RATING
                        // =====================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reviews/food/**"
                        )
                        .permitAll()


                        // =====================================
                        // CUSTOMER + ADMIN
                        // =====================================

                        .requestMatchers(
                                "/api/cart/**",
                                "/api/orders/**",
                                "/api/addresses/**"
                        )
                        .hasAnyRole("CUSTOMER", "ADMIN")


                        // =====================================
                        // ADMIN ONLY
                        // =====================================

                        .requestMatchers("/api/admin/**")
                        .hasRole("ADMIN")


                        // =====================================
                        // PAYMENT APIs
                        // =====================================

                        .requestMatchers("/api/payment/**")
                        .hasAnyRole("CUSTOMER", "ADMIN")


                        // =====================================
                        // CREATE COUPON - ADMIN
                        // =====================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/coupons"
                        )
                        .hasRole("ADMIN")


                        // =====================================
                        // APPLY COUPON
                        // =====================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/coupons/apply"
                        )
                        .hasAnyRole("CUSTOMER", "ADMIN")


                        // =====================================
                        // REVIEW APIs
                        // =====================================

                        .requestMatchers("/api/reviews/**")
                        .hasAnyRole("CUSTOMER", "ADMIN")


                        // =====================================
                        // EVERYTHING ELSE
                        // =====================================

                        .anyRequest()
                        .authenticated()
                )


                // Authentication Provider
                .authenticationProvider(authenticationProvider)


                // JWT Filter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}