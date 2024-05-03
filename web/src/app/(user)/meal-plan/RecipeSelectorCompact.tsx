"use client";
import React, { useState, useEffect, useCallback, ReactNode } from "react";
import {
  SearchIcon,
  CloseIcon,
  PlusIcon,
  RecipeIcon,
  OpenIcon,
} from "@/components/icons";
import { RecipeResponse, getAll } from "@/api/recipes";
import { useAsync } from "@/hooks/useAsync";
import { ThrowError } from "@/components/throw-error";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { ClientPagination as Pagination } from "@/components/pagination";
import {
  Button,
  Dialog,
  Flex,
  IconButton,
  Link,
  ScrollArea,
} from "@radix-ui/themes";
import useAxios from "@/hooks/useAxios";
import { PaginatedResponse } from "@/api/response";
import { SearchForm, SearchFormParams } from "@/components/search-form";
import { RecipeListPlaceholder } from "../loading";
import { RecipeCard } from "@/components/recipe";
import { List, ListItem, ListHeader } from "@/components/list";
import { imgUrl } from "@/helpers";

export interface RecipeSelectorCompactProps {
  children?: ReactNode;
  onSelect: (props: any) => void;
}

export default function RecipeSelectorCompact({
  children,
  onSelect,
}: RecipeSelectorCompactProps) {
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  const AxiosClientSide = useAxios();

  const onSearch = (searchParams: SearchFormParams) => {
    setSearchParams(searchParams);
  };
  const onFetchError = (errorMessage: string) => {
    setError(errorMessage);
  };
  const [error, setError] = useState("");
  const {
    loading: getRecipesLoading,
    request: getRecipesRequestFunc,
    data: recipesData,
  } = useAsync<PaginatedResponse<RecipeResponse>>(
    (searchParams: Record<string, string>) =>
      getAll(searchParams, AxiosClientSide),
    { onError: onFetchError }
  );
  const getRecipesRequest = useCallback(getRecipesRequestFunc, [searchParams]);
  useEffect(() => {
    getRecipesRequest(searchParams);
  }, [searchParams]);

  const getEmptyPlacholderProps = () => {
    const query = searchParams.search;
    if (query) {
      return {
        title: `No Recipe matching "${query}"`,
        subtitle: "Try searching another phrase",
      };
    }
    if (getRecipesLoading) {
      return {
        title: `Loading...Please Wait!`,
      };
    }
    return {
      title: "You have not created any recipes yet!",
      href: "/recipes/create",
      cta: "Add Recipe",
    };
  };
  return (
    <>
      {error && <ThrowError error={error} />}
      {getRecipesLoading && <EmptyPlaceholder {...getEmptyPlacholderProps()} />}
      {recipesData && !getRecipesLoading && (
        <>
          <List>
            <ListHeader>
              <SearchForm defaultValues={{}} callback={onSearch} />
            </ListHeader>
            <ScrollArea scrollbars="vertical" className="max-h-[50vh]">
              {recipesData.items.map(({ ...props }: any) => (
                <ListItem key={props.id}>
                  {onSelect && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onSelect(props);
                      }}
                    >
                      {props.name}
                    </Button>
                  )}
                </ListItem>
              ))}

              {recipesData.totalItems < 1 && (
                <EmptyPlaceholder {...getEmptyPlacholderProps()} />
              )}
            </ScrollArea>
          </List>

          {recipesData.totalItems > 0 && (
            <Pagination
              size={recipesData.size}
              currentItems={recipesData.currentItems}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              totalItems={recipesData.totalItems}
              currentPage={recipesData.currentPage}
              totalPages={recipesData.totalPages}
            />
          )}
        </>
      )}
    </>
  );
}
