export const insightPrompt = (data:any)=>{
    const prompt =
    data.total &&
    data.frequencyByRecipe?
    `Given the following information about the meal plan:

Time Interval: ${data.view}
Total Meals: ${data.total.meals || 0}
Total Calories: ${data.total.calories || 0}
Total Carbohydrate: ${data.total.carbohydrates || 0}
Total Cholesterol: ${data.total.cholesterol || 0}
Total Fiber: ${data.total.fiber || 0}
Total Protein: ${data.total.protein || 0}
Total Saturated Fat: ${data.total.saturatedFat || 0}
Total Sodium: ${data.total.sodium || 0}
Total Sugar: ${data.total.sugar || 0}
Total Fat: ${data.total.totalFat || 0}

And the following information about the meals and the count of how many times they are included in the meal plan:

${
  data.frequencyByRecipe &&
  data.frequencyByRecipe.length > 0 &&
  data.frequencyByRecipe.reduce(
    (prev: any, current: any) =>
      prev + current.recipe + ": " + current.count + "\n",
    ""
  )
}

Generate for me an insight about the meal plan that includes the following information:

 - Completeness of the meal plan(is the quantity of the meals included sufficient for the time interval of the meal plan)
 - What are the positive comments you have on the meal plan
 - What vital nutrients are missing from the meal plan
 - What new meals should be included or excluded to make the meal plan more healthy and complete
 - A short summary about the insight generated
 
 return the result in a markdown formatted text.
 Do not include a title of Meal Plan Insight or Insight into the result text.
 `:"";
 return prompt;
};