"use client";

import { FormEvent, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type Filter = "all" | "active" | "done";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "done") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const completedCount = todos.filter((todo) => todo.completed).length;

  function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = newTodo.trim();
    if (!trimmed) {
      return;
    }

    setTodos((current) => [
      {
        id: Date.now(),
        text: trimmed,
        completed: false,
      },
      ...current,
    ]);
    setNewTodo("");
  }

  function toggleTodo(id: number) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function updateTodo(id: number) {
    const trimmed = editingText.trim();
    if (!trimmed) {
      return;
    }

    setTodos((current) => current.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo)));
    setEditingId(null);
    setEditingText("");
  }

  function deleteTodo(id: number) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-start px-4 py-12 sm:px-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>My Todo List</CardTitle>
          <CardDescription>Cute lil&apos; CRUD board with shadcn-style components ✨</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">Total: {todos.length}</Badge>
            <Badge variant="secondary">Done: {completedCount}</Badge>
            <Badge variant="secondary">Left: {todos.length - completedCount}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={createTodo} className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(event) => setNewTodo(event.target.value)}
              placeholder="Add a task..."
              aria-label="Add a task"
            />
            <Button type="submit">Add</Button>
          </form>

          <div className="flex flex-wrap gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
              Active
            </Button>
            <Button variant={filter === "done" ? "default" : "outline"} onClick={() => setFilter("done")}>
              Done
            </Button>
          </div>

          <ul className="space-y-3">
            {filteredTodos.length === 0 ? (
              <li className="rounded-md border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
                No todos yet — add your first one.
              </li>
            ) : (
              filteredTodos.map((todo) => (
                <li key={todo.id} className="rounded-lg border border-zinc-200 p-3">
                  {editingId === todo.id ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Input value={editingText} onChange={(event) => setEditingText(event.target.value)} />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateTodo(todo.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        onClick={() => toggleTodo(todo.id)}
                        className="text-left"
                        aria-label={todo.completed ? `Mark ${todo.text} as active` : `Mark ${todo.text} as done`}
                      >
                        <p className={todo.completed ? "text-zinc-400 line-through" : "text-zinc-900"}>{todo.text}</p>
                      </button>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => startEditing(todo)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteTodo(todo.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
