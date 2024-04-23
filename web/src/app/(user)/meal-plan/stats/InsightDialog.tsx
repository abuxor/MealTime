"use client";
import { CloseIcon, BulbIcon, FaceFrownIcon } from "@/components/icons";
import useAxios from "@/hooks/useAxios";
import Markdown from 'react-markdown'
import { generateInsight } from "@/api/mealPlan";
import { useAsync } from "@/hooks/useAsync";
import { Button, Dialog, Flex, IconButton } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Card } from "@/components/card";

interface InsightDialogProps {
  data: any;
}

export default function InsightDialog({ data }: InsightDialogProps) {
  const AxiosClientSide = useAxios();
  const [open, setOpen] = useState(false);
  const [coldOpen, setColdOpen] = useState(true);
  const onGenerateInsight = async () => {
    const prompt =
      data.total &&
      data.frequencyByRecipe &&
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
   `;

    return await generateInsight({ prompt }, AxiosClientSide);
  };

  const {
    loading,
    request: onDialogOpen,
    error,
    data: res,
  } = useAsync(onGenerateInsight, {});
  useEffect(() => {
    if (open && coldOpen) {
      setColdOpen(false);
      onDialogOpen();
    }
  }, [open, coldOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="soft">
          <BulbIcon />
          AI Insight
        </Button>
      </Dialog.Trigger>

      <Dialog.Content className="min-w-[20%] min-h-[20vh]">
        <Dialog.Title>
          <Flex justify="between" align="center">
            <Flex gap="1">
              <BulbIcon /> Meal Plan Insight
            </Flex>
            <Dialog.Close>
              <IconButton value="close" variant="ghost">
                <CloseIcon />
              </IconButton>
            </Dialog.Close>
          </Flex>
        </Dialog.Title>

        <Dialog.Description>
          <Card
            className={loading ? "mt-10" :"mt-6"}
            isLoading={loading}
            border={false}
            loadingMessage="Generating Insight for your meal plan...."
          >
            {error && (
              <EmptyPlaceholder
                image={<FaceFrownIcon className="w-32 h-32 text-rose-200" />}
                title="Oops, something went wrong with AI Insights!"
                subtitle={error}
              />
            )}
              {res &&
                res.insight &&
                <Markdown className="prose">{res.insight}</Markdown>
               }
    
          </Card>
        </Dialog.Description>
      </Dialog.Content>
    </Dialog.Root>
  );
}
