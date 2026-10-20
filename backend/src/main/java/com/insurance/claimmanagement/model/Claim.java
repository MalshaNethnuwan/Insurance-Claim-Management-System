package com.insurance.claimmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "claims")
public class Claim {

    @Id
    private String id;

    @Indexed(unique = true)
    private String claimNumber;

    @Indexed
    private String policyNumber;

    private String policyHolderName;

    @Indexed
    private String claimantEmail;

    private Double claimAmount;

    private Double payoutAmount = 0.0;

    private String incidentDate;

    private String description;

    private ClaimStatus status = ClaimStatus.SUBMITTED;

    private String adjusterNotes = "";

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    public Claim() {}

    public Claim(String claimNumber, String policyNumber, String policyHolderName, String claimantEmail, Double claimAmount, String incidentDate, String description) {
        this.claimNumber = claimNumber;
        this.policyNumber = policyNumber;
        this.policyHolderName = policyHolderName;
        this.claimantEmail = claimantEmail;
        this.claimAmount = claimAmount;
        this.incidentDate = incidentDate;
        this.description = description;
        this.status = ClaimStatus.SUBMITTED;
        this.payoutAmount = 0.0;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getPolicyHolderName() {
        return policyHolderName;
    }

    public void setPolicyHolderName(String policyHolderName) {
        this.policyHolderName = policyHolderName;
    }

    public String getClaimantEmail() {
        return claimantEmail;
    }

    public void setClaimantEmail(String claimantEmail) {
        this.claimantEmail = claimantEmail;
    }

    public Double getClaimAmount() {
        return claimAmount;
    }

    public void setClaimAmount(Double claimAmount) {
        this.claimAmount = claimAmount;
    }

    public Double getPayoutAmount() {
        return payoutAmount;
    }

    public void setPayoutAmount(Double payoutAmount) {
        this.payoutAmount = payoutAmount;
    }

    public String getIncidentDate() {
        return incidentDate;
    }

    public void setIncidentDate(String incidentDate) {
        this.incidentDate = incidentDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public void setStatus(ClaimStatus status) {
        this.status = status;
    }

    public String getAdjusterNotes() {
        return adjusterNotes;
    }

    public void setAdjusterNotes(String adjusterNotes) {
        this.adjusterNotes = adjusterNotes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
