"use client";
import { Card, CardBody, CardHeader } from "@/components/card";
import { getViewDateRange, getNutritionUnit } from "@/helpers";
import { InfoCard } from "@/components/card/InfoCard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import autocolors from "chartjs-plugin-autocolors";
import { Pie, Bar } from "react-chartjs-2";
import { useRouter, useSearchParams } from "next/navigation";
import useAxios from "@/hooks/useAxios";
import { useAsync } from "@/hooks";
import { MealPlanStatsResponse, stats } from "@/api/mealPlan";
import { useCallback, useEffect, useState } from "react";
import {
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  parse,
} from "date-fns";
import InsightDialog from "./InsightDialog";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { PieChartIcon } from "@/components/icons";

ChartJS.register(
  autocolors,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const getView = (view: string) => {
  switch (view) {
    case "month":
      return "Monthly";
    case "week":
      return "Weekly";
    case "day":
      return "Daily";
  }
  return "";
};

const EmptyData = (
  <EmptyPlaceholder
    image={<PieChartIcon className="w-32 h-32 text-rose-200" />}
    title="No data to display at this time"
  />
);

export default function Page({}: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams?.get("view");
  const date = searchParams?.get("date");
  const title =
    view && date
      ? `${getView(view)} Meal Plan Stats (${getViewDateRange(
          parse(date, "yyyy-MM-dd", new Date()),
          view
        )})`.trim()
      : "";
  const AxiosClientSide = useAxios();
  const {
    loading,
    request: requestFunc,
    data,
    error,
  } = useAsync<MealPlanStatsResponse>(
    async (params: any) => await stats(params, AxiosClientSide)
  );
  const request = useCallback(requestFunc, [searchParams]);
  const fmt = (date: Date) => format(date, "yyyy-MM-dd");
  const refetch = useCallback(
    (view: string, date: Date) => {
      let start;
      let end;
      switch (view) {
        case "day":
          start = fmt(date);
          end = fmt(date);
          break;
        case "week":
          start = fmt(startOfWeek(date));
          end = fmt(endOfWeek(date));
          break;
        case "month":
          start = fmt(startOfMonth(date));
          end = fmt(endOfMonth(date));
          break;
      }
      request({ start, end });
    },
    [request]
  );

  useEffect(() => {
    if (!view || !date) {
      router.replace("/404");
    } else {
      refetch(view, parse(date, "yyyy-MM-dd", new Date()));
    }
  }, [searchParams, refetch, router]);
  const [nutritionOption, setNutritionOption] = useState<string>("calories");
  const [mealFreqOption, setMealFreqOption] = useState<string>("type");
  const mealFreqOptions = {
    type: "Meal Type",
    recipe: "Recipe",
  };
  return (
    <Card className="min-h-screen" isLoading={loading}>
      <CardHeader title={title} textSize="3xl"></CardHeader>
      {data ? (
        <CardBody>
          <Card className="mb-2">
            <CardHeader
              title="Meal-AI  - Insight Available!"
              subtitle="Generate AI-Powered Insight from the Meal Plan Stat"
              textSize="xl"
            >
              <InsightDialog data={{ view, date, ...data }} />
            </CardHeader>
          </Card>

          {data.total ? (
            <Card fullHeight>
              <CardHeader
                title="Meal Plan Summary"
                subtitle="Aggregated nutritional content of all meals within the duration of the meal plan"
                textSize="xl"
              ></CardHeader>

              <div className="bg-gray-50 p-4 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                {Object.keys(data.total).map((k: any) => (
                  <InfoCard
                    name={k}
                    value={
                      ((data.total && data.total[k]) || 0) +
                      " " +
                      getNutritionUnit(k)
                    }
                  />
                ))}
              </div>
            </Card>
          ) : (
            ""
          )}

          <div className="grid lg:grid-cols-6 gap-2 mt-4">
            <div className="col-span-6 lg:col-span-3">
              <Card fullHeight>
                <CardHeader
                  title="Nutrition Breakdown by Meal"
                  subtitle="Distribution of nutritional content of meals included in the meal plan"
                  textSize="xl"
                >
                  <select
                    className="select select-bordered p-2"
                    value={nutritionOption}
                    onChange={(e) => setNutritionOption(e.target.value)}
                  >
                    <option value={undefined} selected disabled hidden>
                      Select an Option
                    </option>
                    {data.nutritionSumByRecipe &&
                      data.nutritionSumByRecipe.length > 0 &&
                      Object.keys(data.nutritionSumByRecipe[0])
                        .filter((x) => !x.includes("recipe"))
                        .map((x) => (
                          <option value={x} key={x}>
                            {x.replace(/([A-Z])/g, " $1").trim()} (
                            {getNutritionUnit(x)})
                          </option>
                        ))}
                  </select>
                </CardHeader>
                {data.nutritionSumByRecipe &&
                data.nutritionSumByRecipe.length > 0 ? (
                  <CardBody>
                    {nutritionOption ? (
                      <Pie
                        options={{
                          plugins: {
                            autocolors: {
                              mode: "data",
                            },
                          },
                        }}
                        data={{
                          labels: data.nutritionSumByRecipe.map(
                            ({ recipe }: any) => recipe
                          ),
                          datasets: [
                            {
                              label: nutritionOption,
                              data: data.nutritionSumByRecipe.map(
                                (data: any) => data[nutritionOption]
                              ),
                            },
                          ],
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </CardBody>
                ) : (
                  EmptyData
                )}
              </Card>
            </div>

            <div className="col-span-6 lg:col-span-3">
              <Card>
                <CardHeader
                  title={`Meal Frequency by ${mealFreqOptions[mealFreqOption]}`}
                  subtitle={
                    {
                      type: "A count of the meal types included in the meal plan",
                      recipe:
                        "A count of the occurrence of a recipe in the meal plan",
                    }[mealFreqOption]
                  }
                  textSize="xl"
                >
                  <select
                    className="select select-bordered p-2"
                    value={mealFreqOption}
                    onChange={(e) => setMealFreqOption(e.target.value)}
                  >
                    <option value={undefined} selected disabled hidden>
                      Select an Option
                    </option>
                    {Object.keys(mealFreqOptions).map((k: string) => (
                      <option value={k} key={k}>
                        {mealFreqOptions[k]}
                      </option>
                    ))}
                  </select>
                </CardHeader>
                <CardBody>
                  {mealFreqOption === "type" &&
                  data.frequencyByMealType &&
                  data.frequencyByMealType.length > 0 ? (
                    <Bar
                      options={{
                        plugins: {
                          autocolors: {
                            mode: "data",
                          },
                        },
                      }}
                      data={{
                        labels: data.frequencyByMealType.map(
                          ({ mealType }) => mealType
                        ),
                        datasets: [
                          {
                            label: "Count",
                            data: data.frequencyByMealType.map(
                              ({ count }) => count
                            ),
                          },
                        ],
                      }}
                    />
                  ) : (
                    ""
                  )}
                  {mealFreqOption === "recipe" &&
                  data.frequencyByRecipe &&
                  data.frequencyByRecipe.length > 0 ? (
                    <Bar
                      options={{
                        plugins: {
                          autocolors: {
                            mode: "data",
                          },
                        },
                      }}
                      data={{
                        labels: data.frequencyByRecipe.map(
                          ({ recipe }) => recipe
                        ),
                        datasets: [
                          {
                            label: "Count",
                            data: data.frequencyByRecipe.map(
                              ({ count }) => count
                            ),
                          },
                        ],
                      }}
                    />
                  ) : (
                    ""
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </CardBody>
      ) : (
        ""
      )}
    </Card>
  );
}
