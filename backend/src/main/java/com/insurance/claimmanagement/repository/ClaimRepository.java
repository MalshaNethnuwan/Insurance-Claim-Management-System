package com.insurance.claimmanagement.repository;

import com.insurance.claimmanagement.model.Claim;
import com.insurance.claimmanagement.model.ClaimStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends MongoRepository<Claim, String> {
    Optional<Claim> findByClaimNumber(String claimNumber);
    List<Claim> findByClaimantEmail(String claimantEmail);
    List<Claim> findByPolicyNumber(String policyNumber);
    List<Claim> findByStatus(ClaimStatus status);
    long countByStatus(ClaimStatus status);
}
