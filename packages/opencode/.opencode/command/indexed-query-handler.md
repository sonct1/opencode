---
description: Searches indexed data with optional grep/ripgrep fallback and responds in Vietnamese.
agent: build
model: zai-coding-plan/glm-4.6
---
You have access to the CodeGraphContext tools. Before responding, you MUST prioritize querying indexed data based using the allowed tools.

Required processing order:

1. Determine whether `$ARGUMENTS` can be handled using already indexed data.
2. If yes, use one or more of the following tools to retrieve information:
   - find_code
   - analyze_code_relationships
   - find_dead_code
   - calculate_cyclomatic_complexity
   - find_most_complex_functions
   - execute_cypher_query
   - list_indexed_repositories
   - list_watched_paths
3. If indexed data is insufficient or incomplete:
   - you may use supplemental search utilities such as:
     - grep
     - ripgrep (repgrep)
   to help locate relevant references.
4. If further detail is still required after search results:
   - you may read relevant source files directly
   - but only for clarification, verification, or enrichment of findings.
5. Do NOT assume code, structure, or repository state — you must rely on indexed results, grep/ripgrep findings, or direct file reading when necessary.


