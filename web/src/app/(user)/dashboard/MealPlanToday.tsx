"use client";
import {format} from "date-fns";
import { timeOfDayWelcome } from "@/helpers";
import { CardHeader, Card, CardBody } from '@/components/card';
import { Button } from "@radix-ui/themes";
import Link from 'next/link';
import { ArrowRightIcon, CalendarIcon } from "@/components/icons";
import { DayView } from "@/components/calendar";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import React from "react";

function Banner({ children }: { children: React.ReactNode }) {
  return <header className="text-sm uppercase text-slate-500 bg-slate-50 rounded-sm font-semibold p-4">{children}</header>
}

export default function MealPlanToday({session, mealPlans}) {
  const today = new Date();
  return (<>
   <div className="relative p-4 sm:p-6 overflow-hidden mb-2">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl text-slate-800 font-bold mb-1"> 👋 {timeOfDayWelcome()}, {session?.user?.name.split(" ")[0]}!</h1>
        </div>
      </div>

      <div className="col-span-full mb-6">
          <Card shadow="lg">
            <CardHeader title="From your Weekly Meal Plan">
              <Button asChild variant='ghost'>
                <Link href="/meal-plan">Go to Meal Plan<ArrowRightIcon className='w-4 h-4' />  </Link>
              </Button>
            </CardHeader>
            <CardBody padding='sm'>
              <Banner>
                Today on {format(today, 'yyyy-MM-dd')}
              </Banner>
              <div className='h-auto sm:h-96 overflow-auto'>

                {mealPlans && mealPlans[format(today, 'yyyy-MM-dd')] ?
                  <DayView noHeader date={today} mealPlanLookup={mealPlans} />
                  : <EmptyPlaceholder image={<CalendarIcon className="w-32 h-32 text-rose-200" />} title="Nothing Here!" subtitle="You have not added any meal plans for today" cta='Add Meal Plan' href="/meal-plan/create" />}
              </div>
            </CardBody>
          </Card>
        </div>

  </>)
}
