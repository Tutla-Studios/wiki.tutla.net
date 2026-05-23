---
title: "Parsing"
summary: "Parsing code using Tusan in Tums"
created: "2026-05-23"
updated: "2026-05-23"
isdoc: true
---

In order for your node to work, you have to write the logic (no shit). This is done within the `create` function of your node. The `create` function takes a [Context](/tums/context) and a Token as arguments. The context is a reference to the current state of the parser and contains important information. The token is the current token that the parser is working with.

When the create function is called, the __NEXT token__ is passed (unless your `NodeConfig` is different). 

Let's take a look at this example:
```java
import net.tutla.tums.tusan.TusanContext;
import net.tutla.tums.tusan.node.Node;
import net.tutla.tums.tusan.lexer.Token;
import net.tutla.tums.tusan.nodes.expression.Expression;

public class Print extends Node {
    public Print(TusanContext ctx){
        super(ctx);
    }

    public Print create(){
        System.out.println(new Expression(ctx).create().value);
        return this;
    }
}
```

This is a simple `Print` node that prints the value of an expression. 

Now let's try making a very simple version of a `Print` node that accepts strings:

```java
import net.tutla.tums.tusan.TusanContext;
import net.tutla.tums.tusan.node.Node;
import net.tutla.tums.tusan.lexer.Token;
import net.tutla.tums.tusan.nodes.expression.Expression;

public class Print extends Node {
    public Print(TusanContext ctx){
        super(ctx);
    }

    public Print create(){
        String text = ctx.getCurrentToken().value;
        System.out.println(text);
        return this;
    }
}
```

In this example we use the context to get the current token and print its value. This is a very basic example and does not handle complex expressions. So we can use the in-built `ExpressionNode` to parse an expression and then extract the value from it (the expression node is unique as it has a `value` object that stores the computed expression).

Generally if you want to compute an expression, just use an `ExpressionNode`. It handles function calls, conditions, variables and all other expressions.

