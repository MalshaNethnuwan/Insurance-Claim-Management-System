package com.insurance.claimmanagement.config;

import com.insurance.claimmanagement.model.*;
import com.insurance.claimmanagement.repository.ClaimRepository;
import com.insurance.claimmanagement.repository.PolicyRepository;
import com.insurance.claimmanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PolicyRepository policyRepository,
                           ClaimRepository claimRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        try {
            seedUsers();
            seedPolicies();
            seedClaims();
            logger.info("Database initialization completed successfully.");
        } catch (Exception e) {
            logger.warn("DataInitializer skipped or encountered an issue (e.g. database not reachable yet): {}", e.getMessage());
        }
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            logger.info("Seeding initial demo users...");
            List<User> users = List.of(
                    new User("claimant", passwordEncoder.encode("password123"), "claimant@insurance.demo", "Jane Doe (Claimant)", Role.ROLE_USER),
                    new User("adjuster", passwordEncoder.encode("password123"), "adjuster@insurance.demo", "Marcus Vance (Senior Adjuster)", Role.ROLE_ADJUSTER),
                    new User("admin", passwordEncoder.encode("password123"), "admin@insurance.demo", "DevOps Admin", Role.ROLE_ADMIN)
            );
            userRepository.saveAll(users);
            logger.info("Seeded {} users.", users.size());
        }
    }

    private void seedPolicies() {
        if (policyRepository.count() == 0) {
            logger.info("Seeding initial policies catalog...");
            List<Policy> policies = List.of(
                    new Policy("POL-AUTO-101", "Jane Doe", PolicyType.AUTO, 50000.0, 120.0, "2026-01-01", "2027-01-01"),
                    new Policy("POL-HOME-202", "Jane Doe", PolicyType.HOME, 350000.0, 85.0, "2026-02-15", "2027-02-15"),
                    new Policy("POL-HLTH-303", "Jane Doe", PolicyType.HEALTH, 1000000.0, 240.0, "2026-01-01", "2026-12-31"),
                    new Policy("POL-LIFE-404", "Jane Doe", PolicyType.LIFE, 500000.0, 65.0, "2026-03-01", "2036-03-01")
            );
            policyRepository.saveAll(policies);
            logger.info("Seeded {} policies.", policies.size());
        }
    }

    private void seedClaims() {
        if (claimRepository.count() == 0) {
            logger.info("Seeding sample claims for demonstration...");
            Claim claim1 = new Claim("CLM-2026-001", "POL-AUTO-101", "Jane Doe", "claimant@insurance.demo", 2450.0, "2026-03-10", "Rear bumper damage from low-speed collision in parking lot.");
            claim1.setStatus(ClaimStatus.SUBMITTED);

            Claim claim2 = new Claim("CLM-2026-002", "POL-HOME-202", "Jane Doe", "claimant@insurance.demo", 6800.0, "2026-02-28", "Water damage in basement due to burst copper plumbing pipe during winter freeze.");
            claim2.setStatus(ClaimStatus.UNDER_REVIEW);
            claim2.setAdjusterNotes("Assigned to certified water mitigation surveyor. Awaiting remediation report.");

            Claim claim3 = new Claim("CLM-2026-003", "POL-HLTH-303", "Jane Doe", "claimant@insurance.demo", 1250.0, "2026-01-15", "Emergency department examination and diagnostic radiography.");
            claim3.setStatus(ClaimStatus.APPROVED);
            claim3.setPayoutAmount(1150.0);
            claim3.setAdjusterNotes("In-network benefits verified. Deductible of $100 applied.");

            claimRepository.saveAll(List.of(claim1, claim2, claim3));
            logger.info("Seeded 3 demo claims.");
        }
    }
}
