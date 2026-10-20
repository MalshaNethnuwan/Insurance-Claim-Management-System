package com.insurance.claimmanagement.controller;

import com.insurance.claimmanagement.dto.ClaimRequest;
import com.insurance.claimmanagement.dto.ClaimStatusUpdateRequest;
import com.insurance.claimmanagement.model.Claim;
import com.insurance.claimmanagement.service.ClaimService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@Tag(name = "Claims", description = "Endpoints for claim lifecycle transitions, submissions, and telemetry")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @GetMapping
    @Operation(summary = "List all claims in queue")
    public ResponseEntity<List<Claim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/track/{claimNumber}")
    @Operation(summary = "Public tracking of claim lifecycle progress by claim reference number")
    public ResponseEntity<Claim> trackClaim(@PathVariable String claimNumber) {
        return ResponseEntity.ok(claimService.getClaimByNumber(claimNumber));
    }

    @PostMapping
    @Operation(summary = "Submit a new insurance claim on a policy")
    public ResponseEntity<Claim> createClaim(@Valid @RequestBody ClaimRequest request, Authentication authentication) {
        String currentUsername = authentication != null ? authentication.getName() : null;
        Claim claim = claimService.createClaim(request, currentUsername);
        return ResponseEntity.status(HttpStatus.CREATED).body(claim);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADJUSTER', 'ADMIN')")
    @Operation(summary = "Update claim lifecycle status and payout amount (Adjuster/Admin only)")
    public ResponseEntity<Claim> updateClaimStatus(
            @PathVariable String id,
            @Valid @RequestBody ClaimStatusUpdateRequest request) {
        Claim updated = claimService.updateClaimStatus(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/metrics")
    @PreAuthorize("hasAnyRole('ADJUSTER', 'ADMIN')")
    @Operation(summary = "Get aggregate claim telemetry and queue metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        return ResponseEntity.ok(claimService.getMetrics());
    }
}
