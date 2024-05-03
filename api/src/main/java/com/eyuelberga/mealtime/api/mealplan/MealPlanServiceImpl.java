package com.eyuelberga.mealtime.api.mealplan;

import com.eyuelberga.mealtime.api.recipe.RecipeService;
import com.eyuelberga.mealtime.api.security.PrincipalUtils;
import com.eyuelberga.mealtime.api.shared.exceptions.ResourceNotFoundException;
import com.eyuelberga.mealtime.api.mealplan.dto.response.*;
import com.eyuelberga.mealtime.api.recipe.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.MediaType;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

import java.sql.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MealPlanServiceImpl implements MealPlanService {

    private final MealPlanRepository mealPlanRepository;

    private final RecipeService recipeService;

     @Value("${services.mealplan-insight.endpoint}")
    private String mealPlanInsightEndpoint;

    @Override
    public MealPlan create(MealPlan mealPlan) {
        return mealPlanRepository.save(mealPlan);
    }

    @Override
    public MealPlan create(MealPlan mealPlan, String recipeId) {
        mealPlan.setRecipe(recipeService.get(recipeId));
        return create(mealPlan);
    }

    @Override
    public MealPlan update(MealPlan mealPlan) {
        MealPlan oldMealPlan = get(mealPlan.getId());
        mealPlan.setCreatedBy(oldMealPlan.getCreatedBy());
        return mealPlanRepository.save(mealPlan);
    }

    @Override
    public MealPlan update(MealPlan mealPlan, String recipeId) {
        mealPlan.setRecipe(recipeService.get(recipeId));
        return update(mealPlan);
    }

    @Override
    public void remove(String mealPlanId) {
        if (mealPlanRepository.existsById(mealPlanId)) {
            mealPlanRepository.deleteById(mealPlanId);
        } else {
            throw new ResourceNotFoundException("Could not find meal plan");
        }


    }

    @Override
    public MealPlan get(String mealPlanId) {
        MealPlan mealPlan = mealPlanRepository.findByIdAndCreatedBy(mealPlanId, PrincipalUtils.getId()).orElse(null);
        if (mealPlan != null) {
            return mealPlan;
        } else {
            throw new ResourceNotFoundException("Could not find meal plan");
        }
    }

    @Override
    public List<MealPlan> getAllInRange(Date start, Date end) {
        return mealPlanRepository.findAllByDateBetweenAndCreatedBy(start, end, PrincipalUtils.getId()).stream().toList();

    }

    @Override
    public MealPlanStatsResponse getSumInRange(Date start, Date end) {
        String principalId = PrincipalUtils.getId();
        MealPlanAggregateResponse total = mealPlanRepository.nutritionSumDateBetweenAndCreatedBy(start, end, principalId);
        List<MealFrequencyByMealTypeResponse> mealFrequencyByMealType = mealPlanRepository.mealFrequencyByMealType(start, end, principalId);
        List<MealFrequencyByRecipeResponse> mealFrequencyByRecipeResponses = mealPlanRepository.mealFrequencyByRecipe(start, end, principalId);
        List<MealPlanAggregateByRecipeResponse> nutritionSumByRecipe = mealPlanRepository.sumByRecipe(start, end, principalId);
        return MealPlanStatsResponse.builder()
                .total(total)
                .frequencyByMealType(mealFrequencyByMealType)
                .frequencyByRecipe(mealFrequencyByRecipeResponses)
                .nutritionSumByRecipe(nutritionSumByRecipe)
                .build();

    }

    @Override
    public MealPlanInsight generateInsight(String prompt) {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("prompt", prompt);
        MealPlanInsight response = null;
        try {
            response = WebClient.create().post()
                    .uri(new URI(mealPlanInsightEndpoint))
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(MealPlanInsight.class).share()
                    .block();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
        return response;
    }
}
