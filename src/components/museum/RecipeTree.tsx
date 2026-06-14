// src/components/museum/RecipeTree.tsx
import React, { FC } from "react";
import RecipeNode from "./RecipeNode";

type RecipeTreeProps = {
  recipe: any;
  detailsIndex: any;

  gatherResources: (recipe: any, detailsIndex: any) => Record<string, number>;
  setCategory: (id: string) => string;
  NO_DECOMPOSE_PREFIXES: string[];
};

export const RecipeTree: FC<RecipeTreeProps> = ({
  recipe,
  detailsIndex,
  gatherResources,
  setCategory,
  NO_DECOMPOSE_PREFIXES,
}) => {
  if (!recipe || !recipe.ingredients) return <></>;

  // On se passe nous-mêmes à RecipeNode via une closure de composant
  const RecipeTreeSelf: FC<{ recipe: any; detailsIndex: any }> = (props) => (
    <RecipeTree
      recipe={props.recipe}
      detailsIndex={props.detailsIndex}
      gatherResources={gatherResources}
      setCategory={setCategory}
      NO_DECOMPOSE_PREFIXES={NO_DECOMPOSE_PREFIXES}
    />
  );

  return (
    <ul>
      {recipe.ingredients.map((ing: any, i: number) => (
        <RecipeNode
          key={i}
          ing={ing}
          detailsIndex={detailsIndex}
          gatherResources={gatherResources}
          setCategory={setCategory}
          NO_DECOMPOSE_PREFIXES={NO_DECOMPOSE_PREFIXES}
          RecipeTree={RecipeTreeSelf}
        />
      ))}
    </ul>
  );
};

export default RecipeTree;
