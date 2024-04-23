import { CardHeader, Card, CardBody } from '@/components/card';
import { ArrowRightIcon } from '@/components/icons';
import { RecipeCard } from '@/components/recipe';
import { Button } from "@radix-ui/themes";
import { List, ListItem, ListHeader } from "@/components/list";
import Link from 'next/link';
import { getServerSession } from "next-auth"
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { CollectionResponse, getAll as getAllCollections } from '@/api/collections';
import { getAll as getAllRecipes, RecipeResponse } from '@/api/recipes';
import { lookup as getMealPlan } from '@/api/mealPlan';
import { PaginatedResponse } from '@/api/response';
import { imgUrl} from '@/helpers';

import { EmptyPlaceholder } from "@/components/empty-placeholder";
import {  CollectionIcon, RecipeIcon } from '@/components/icons';
import MealPlanToday from './MealPlanToday';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  const recentCollections: PaginatedResponse<CollectionResponse> = (await getAllCollections({ sort: "createdAt,desc", size: 5 })).data;
  const recentRecipes: PaginatedResponse<RecipeResponse> = (await getAllRecipes({ sort: "createdAt,desc", size: 6 })).data;
  const mealPlans = (await getMealPlan(null)).data;
  const today = new Date();

  return (
    <>
    <MealPlanToday session={session} mealPlans={mealPlans}/>

      <div className="grid grid-cols-12 gap-6">
       
        <div className="col-span-full xl:col-span-4">

          {recentCollections && recentCollections.items && <Card className='h-full' shadow='lg'>
            <CardBody>
              <List>
                <ListHeader>
                  <>
                    <div>
                      <h2 className="font-semibold text-slate-800">Recently Created Collections</h2>
                    </div>
                    <div className="shrink-0 self-end ml-2">
                      <Button variant='ghost' asChild>
                        <Link href="/collections">View All <ArrowRightIcon className='w-4 h-4' /></Link>
                      </Button>
                    </div>
                  </>
                </ListHeader>

                {recentCollections.items.length > 0 ? recentCollections.items.map(({ name, id }) => (
                  <ListItem key={id}>
                    <Button variant='ghost' asChild>
                      <Link href={`/collections/${id}`}>{name}</Link>
                    </Button>
                  </ListItem>))
                  :
                  <EmptyPlaceholder image={<CollectionIcon className="w-32 h-32 text-rose-200" />} title="No collections created!" subtitle='You can organize your recipes using collections. Create one to get started!' cta='Create Collection' href="/collections/create" />
                }

              </List>
            </CardBody>
          </Card>}

        </div>
        <div className="col-span-full xl:col-span-8">
          {recentRecipes && recentRecipes.items && <Card shadow="lg">
            <CardHeader title="Recently Added Recipes">
              <Button asChild variant='ghost'>
                <Link href="/recipes">View All <ArrowRightIcon className='w-4 h-4' /></Link>
              </Button>
            </CardHeader>
            <CardBody padding='sm'>

              {recentRecipes.items.length > 0 ? <div className='grid gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 py-2'>
                {recentRecipes.items.map(({ image, ...props }) => (<RecipeCard {...props} key={props.id} image={image ? imgUrl(image) : undefined} href={`/recipes/${props.id}`} />))}
              </div>
                :
                <EmptyPlaceholder image={<RecipeIcon className="w-32 h-32 text-rose-200" />} title="No Recipes!" subtitle="You have not created any recipes yet" cta='Create Recipe' href="/recipes/create" />
              }

            </CardBody>
          </Card>}
        </div>

      </div>

    </>
  );
}