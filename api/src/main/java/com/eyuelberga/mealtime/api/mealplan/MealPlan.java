package com.eyuelberga.mealtime.api.mealplan;


import com.eyuelberga.mealtime.api.security.Auditable;
import com.eyuelberga.mealtime.api.recipe.Recipe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.Date;

@Entity
@Table(name = "meal_plans")
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlan extends Auditable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType mealType;
    @ManyToOne
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;
}
