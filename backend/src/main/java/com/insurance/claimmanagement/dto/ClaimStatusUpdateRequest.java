package com.insurance.claimmanagement.dto;

import com.insurance.claimmanagement.model.ClaimStatus;
import jakarta.validation.constraints.NotNull;

public class ClaimStatusUpdateRequest {

    @NotNull(message = "Claim status is required")
    private ClaimStatus status;

    private String adjusterNotes;

    private Double payoutAmount;

    public ClaimStatusUpdateRequest() {}

    public ClaimStatusUpdateRequest(ClaimStatus status, String adjusterNotes, Double payoutAmount) {
        this.status = status;
        this.adjusterNotes = adjusterNotes;
        this.payoutAmount = payoutAmount;
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

    public Double getPayoutAmount() {
        return payoutAmount;
    }

    public void setPayoutAmount(Double payoutAmount) {
        this.payoutAmount = payoutAmount;
    }
}
