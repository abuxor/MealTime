package com.eyuelberga.mealtime.api.mealplan.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MealPlanInsightRequest {
    @NotBlank
    private String prompt;
}
