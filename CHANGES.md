10 
Why these are good candidates — directly from the manuscript
The manuscript says arrow functions are function expressions whose important difference is semantic, not merely shorter syntax. Specifically, they do not receive their own this, have no own arguments, and cannot be invoked with new.
The script then says arrows make sense when lexical this is intended, especially for callbacks, while regular methods should be used when the receiving object determines this.
Pick one function you did not convert.
In particular, I would not convert a regular object method that depends on its receiving object through this. The current starter code does not contain such a user-defined method, but the manuscript's filterState.matches example demonstrates why that conversion would be incorrect.
The general Problem with this:
Because an arrow function does not get its own this when you call it.
The “this” inside a function of an object does not refer to the object of the function (in an arrow function) but rather the “this” becomes “undefined”

Theory Questions:
1. How does this differ? Why risky for methods but useful for callbacks?
•	A regular function can receive its own this depending on how it is called
•	An arrow function does not get its own this. Instead, this is resolved from the surrounding lexical scope where the arrow function was created.
o	But this behavior is useful for callbacks, because the callback does not create a new this; it keeps the surrounding one. The manuscript uses exactly this idea in its callback example.
	A callback is simply a function that you give to another function so it can be called later
•	Usefulness:
o	Because it lets a callback still use the context around where it was created, even when it runs later.
o	That is exactly why the manuscript says arrow functions are especially suitable for callbacks that should retain the surrounding context. For a normal function in form of a callback “this” would not automatically retain the context.
2. Arrow functions can't be used as constructors (no `new`) and have no `arguments` object of their own. Did either limitation affect which functions you were able to convert? Which one, and how?
•	No, neither limitation affected the functions I converted. The functions I changed were not used as constructors with new, and they did not rely on the special arguments object.
•	The event-listener callback also receives its event explicitly as e (event object the browser supplies automatically when an event happens), so it does not need arguments.
3. Function declarations (`function foo() {}`) are hoisted, so you can call them before they appear later in the file; a `const`/`let` arrow function is not. Did this matter anywhere in your refactor? Explain why or why not.
“Hoisted” means the function declaration is made available before JavaScript reaches the line where you wrote it.
In my refactor this did not matter because the functions I converted are only called after their declarations.
4. Show a concrete before/after of one function you converted. Is there any behavioral difference at runtime, or is this purely a readability/style change? Justify your answer.
Before
 
After
 
For the way this function is used in the app, there is no observable behavioral difference at runtime. It still receives status, performs the same checks, and returns the same CSS class.
However, the two forms are not generally identical. The arrow-function version does not have its own this or arguments, cannot be called with new, and because it is stored in a const, it cannot be called before its declaration line.
5. This codebase mixes function declarations, function expressions, and (after this exercise) arrow functions, with no single consistent rule. Propose one rule your team could adopt for "when do we use which," and justify it.
Our team rule would be: use arrow functions for callbacks and small functions that do not need their own this; use regular methods when this should refer to the receiving object; and use function declarations when hoisting is intentionally useful.

------------------------------------------------------------------------------------------------------------