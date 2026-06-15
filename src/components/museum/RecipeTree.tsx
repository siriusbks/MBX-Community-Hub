/*
 * MBX, Community Based Project
 * Copyright (c) 2024 SiriusB_
 * SPDX-License-Identifier: MIT
 */

import React from "react";
import RecipeNode from "./RecipeNode";

type RecipeTreeProps = {
    recipe: any;
    detailsIndex: any;

    setCategory: (id: string) => string;
};

/*
 * RecipeTree recursive
*/
export const RecipeTree: React.FC<RecipeTreeProps> = ({
    recipe,
    detailsIndex,
    setCategory,
}) => {
    if (!recipe || !recipe.ingredients) return <></>;

    // We pass ourselves to RecipeNode using a component closure
    const RecipeTreeSelf: React.FC<{ recipe: any; detailsIndex: any }> = (props) => (
        <RecipeTree
            recipe={props.recipe}
            detailsIndex={props.detailsIndex}
            setCategory={setCategory}
        />
    );

    return (
        <ul>
            {recipe.ingredients.map((ing: any, i: number) => (
                <RecipeNode
                    key={i}
                    ing={ing}
                    detailsIndex={detailsIndex}
                    setCategory={setCategory}
                    RecipeTree={RecipeTreeSelf}
                />
            ))}
        </ul>
    );
};

export default RecipeTree;
