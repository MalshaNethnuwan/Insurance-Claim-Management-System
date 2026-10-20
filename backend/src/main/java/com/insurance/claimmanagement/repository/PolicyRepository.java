package com.insurance.claimmanagement.repository;

import com.insurance.claimmanagement.model.Policy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PolicyRepository extends MongoRepository<Policy, String> {
    Optional<Policy> findByPolicyNumber(String policyNumber);
    Boolean existsByPolicyNumber(String policyNumber);
}
