# Application Architecture

# We want to traverse down the Figma DOM with DFS, parsing every level of node into a useful JSX component along the way

Algorithm:
1. If current node cannot be broken down further (ie. button, form)
    1. Parse node into a useful format
    1. Use ML to classify the node in said useful format
    2. Parse button type and styling attributes into a useful JSX document
    3. Return said jsx document
2. If the current node can be broken down further
    1. Determine the direction of the elements (vertical or horizontal?)
    2. Determine the spacing between the chidren 
    3. Recursively run this algorithm on each of the children elements
    4. Nest the children with an appropriate div

Key observations:
1. buttons have centered text, inputs typically have left aligned text