package com.insurance.claimmanagement.service;

import com.insurance.claimmanagement.dto.PolicyRequest;
import com.insurance.claimmanagement.model.Policy;
import com.insurance.claimmanagement.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    public Policy getPolicyByNumber(String policyNumber) {
        return policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found: " + policyNumber));
    }

    public Policy createPolicy(PolicyRequest request) {
        if (policyRepository.existsByPolicyNumber(request.getPolicyNumber())) {
            throw new IllegalArgumentException("Policy number already exists: " + request.getPolicyNumber());
        }

        Policy policy = new Policy(
                request.getPolicyNumber(),
                request.getPolicyHolderName(),
                request.getType(),
                request.getCoverageAmount(),
                request.getPremiumAmount(),
                request.getStartDate(),
                request.getEndDate()
        );

        return policyRepository.save(policy);
    }
}
