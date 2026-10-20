package com.insurance.claimmanagement.service;

import com.insurance.claimmanagement.dto.ClaimRequest;
import com.insurance.claimmanagement.dto.ClaimStatusUpdateRequest;
import com.insurance.claimmanagement.model.Claim;
import com.insurance.claimmanagement.model.ClaimStatus;
import com.insurance.claimmanagement.model.Policy;
import com.insurance.claimmanagement.repository.ClaimRepository;
import com.insurance.claimmanagement.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;

    public ClaimService(ClaimRepository claimRepository, PolicyRepository policyRepository) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim getClaimById(String id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with id: " + id));
    }

    public Claim getClaimByNumber(String claimNumber) {
        return claimRepository.findByClaimNumber(claimNumber)
                .orElseThrow(() -> new IllegalArgumentException("Claim not found with number: " + claimNumber));
    }

    public List<Claim> getClaimsByEmail(String email) {
        return claimRepository.findByClaimantEmail(email);
    }

    public Claim createClaim(ClaimRequest request, String currentUsername) {
        String holderName = request.getPolicyHolderName();
        String claimantEmail = request.getClaimantEmail();

        Optional<Policy> policyOpt = policyRepository.findByPolicyNumber(request.getPolicyNumber());
        if (policyOpt.isPresent()) {
            Policy policy = policyOpt.get();
            if (holderName == null || holderName.isBlank()) {
                holderName = policy.getPolicyHolderName();
            }
        }

        if (holderName == null || holderName.isBlank()) {
            holderName = currentUsername != null ? currentUsername : "Policy Holder";
        }
        if (claimantEmail == null || claimantEmail.isBlank()) {
            claimantEmail = currentUsername != null ? currentUsername + "@insurance.demo" : "claimant@insurance.demo";
        }

        String claimNumber = generateUniqueClaimNumber();

        Claim claim = new Claim(
                claimNumber,
                request.getPolicyNumber(),
                holderName,
                claimantEmail,
                request.getClaimAmount(),
                request.getIncidentDate(),
                request.getDescription()
        );

        return claimRepository.save(claim);
    }

    public Claim updateClaimStatus(String id, ClaimStatusUpdateRequest request) {
        Claim claim = getClaimById(id);
        ClaimStatus currentStatus = claim.getStatus();
        ClaimStatus targetStatus = request.getStatus();

        validateStatusTransition(currentStatus, targetStatus);

        claim.setStatus(targetStatus);
        if (request.getAdjusterNotes() != null) {
            claim.setAdjusterNotes(request.getAdjusterNotes());
        }

        if (request.getPayoutAmount() != null && request.getPayoutAmount() > 0) {
            claim.setPayoutAmount(request.getPayoutAmount());
        }

        claim.setUpdatedAt(Instant.now());
        return claimRepository.save(claim);
    }

    private void validateStatusTransition(ClaimStatus current, ClaimStatus target) {
        if (current == ClaimStatus.SETTLED || current == ClaimStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot transition claim in terminal status: " + current);
        }

        if (current == ClaimStatus.SUBMITTED) {
            if (target != ClaimStatus.UNDER_REVIEW && target != ClaimStatus.REJECTED) {
                throw new IllegalArgumentException("Submitted claim can only transition to UNDER_REVIEW or REJECTED");
            }
        } else if (current == ClaimStatus.UNDER_REVIEW) {
            if (target != ClaimStatus.APPROVED && target != ClaimStatus.REJECTED) {
                throw new IllegalArgumentException("Under review claim can only transition to APPROVED or REJECTED");
            }
        } else if (current == ClaimStatus.APPROVED) {
            if (target != ClaimStatus.SETTLED) {
                throw new IllegalArgumentException("Approved claim can only transition to SETTLED");
            }
        }
    }

    public Map<String, Object> getMetrics() {
        List<Claim> allClaims = claimRepository.findAll();

        long totalClaims = allClaims.size();
        long pendingReview = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.SUBMITTED || c.getStatus() == ClaimStatus.UNDER_REVIEW)
                .count();
        long approvedCount = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.APPROVED)
                .count();
        long settledCount = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.SETTLED)
                .count();
        long rejectedCount = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.REJECTED)
                .count();

        double totalPayout = allClaims.stream()
                .filter(c -> c.getStatus() == ClaimStatus.APPROVED || c.getStatus() == ClaimStatus.SETTLED)
                .mapToDouble(c -> c.getPayoutAmount() != null ? c.getPayoutAmount() : 0.0)
                .sum();

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalClaims", totalClaims);
        metrics.put("pendingReview", pendingReview);
        metrics.put("approvedCount", approvedCount);
        metrics.put("settledCount", settledCount);
        metrics.put("rejectedCount", rejectedCount);
        metrics.put("totalPayout", totalPayout);

        return metrics;
    }

    private String generateUniqueClaimNumber() {
        int year = Year.now().getValue();
        for (int i = 0; i < 10; i++) {
            int randomNum = ThreadLocalRandom.current().nextInt(100, 999);
            String candidate = String.format("CLM-%d-%03d", year, randomNum);
            if (claimRepository.findByClaimNumber(candidate).isEmpty()) {
                return candidate;
            }
        }
        return String.format("CLM-%d-%d", year, System.currentTimeMillis() % 10000);
    }
}
