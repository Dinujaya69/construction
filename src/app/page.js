"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectOverview() {
  const [projects, setProjects] = useState([
    { id: "1", name: "p1", completion: 100 },
    { id: "2", name: "p2", completion: 0 },
  ]);
  const [newProjectName, setNewProjectName] = useState("");
  const [open, setOpen] = useState(false);

  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject = {
        id: Date.now().toString(),
        name: newProjectName,
        completion: 0,
      };
      setProjects([...projects, newProject]);
      setNewProjectName("");
      setOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center py-4 px-6 bg-gray-100 rounded-t-md">
        <h1 className="text-2xl font-semibold text-gray-700">
          Project Overview
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="mr-1 h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
            </div>
            <Button onClick={addProject}>Add Project</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-6 shadow-sm flex flex-col items-center"
          >
            <CircleProgress percentage={project.completion} />
            <p className="mt-4 text-lg font-medium">{project.name}</p>
            <div className="flex gap-2 mt-4">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                View
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  setProjects(projects.filter((p) => p.id !== project.id))
                }
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircleProgress({ percentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#4CAF50"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute text-xl font-bold">{percentage}%</div>
    </div>
  );
}
