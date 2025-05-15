"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Upload,
  Trash2,
  X,
  ImageIcon,
  Edit,
  MoreHorizontal,
} from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/MainLayout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import BASE_URL from "@/API/config";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ProjectOverview() {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    note: "",
  });
  const [files, setFiles] = useState([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [projectFiles, setProjectFiles] = useState([]);
  const [projectFilePreviewUrls, setProjectFilePreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Generate preview URLs for files
  useEffect(() => {
    if (files.length > 0) {
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setFilePreviewUrls(newPreviewUrls);

      // Cleanup function to revoke object URLs
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [files]);

  // Generate preview URLs for project files
  useEffect(() => {
    if (projectFiles.length > 0) {
      const newPreviewUrls = projectFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setProjectFilePreviewUrls(newPreviewUrls);

      // Cleanup function to revoke object URLs
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [projectFiles]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch projects");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editMode && selectedProject) {
      setSelectedProject({
        ...selectedProject,
        [name]: value,
      });
    } else {
      setNewProject({
        ...newProject,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 5);
      if (editMode) {
        setProjectFiles(selectedFiles);
      } else {
        setFiles(selectedFiles);
      }
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files) {
        const droppedFiles = Array.from(e.dataTransfer.files)
          .filter((file) => file.type.startsWith("image/"))
          .slice(0, 5);

        if (droppedFiles.length === 0) {
          toast.error("Please drop image files only");
          return;
        }

        if (editMode) {
          setProjectFiles(droppedFiles);
        } else {
          setFiles(droppedFiles);
        }
      }
    },
    [editMode]
  );

  const removeFile = (index) => {
    if (editMode) {
      setProjectFiles(projectFiles.filter((_, i) => i !== index));
      setProjectFilePreviewUrls(
        projectFilePreviewUrls.filter((_, i) => i !== index)
      );
    } else {
      setFiles(files.filter((_, i) => i !== index));
      setFilePreviewUrls(filePreviewUrls.filter((_, i) => i !== index));
    }
  };

  const addProject = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to create a project");
      return;
    }

    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);
      formData.append("note", newProject.note);

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(`${BASE_URL}/projects`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProjects([...projects, response.data.newProject]);
      setNewProject({ name: "", description: "", note: "" });
      setFiles([]);
      setFilePreviewUrls([]);
      setOpen(false);
      toast.success("Project created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async () => {
    if (!isAuthenticated || !selectedProject) {
      toast.error("You must be logged in to update a project");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", selectedProject.name);
      formData.append("description", selectedProject.description);
      formData.append("note", selectedProject.note);

      projectFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.put(
        `${BASE_URL}/projects/${selectedProject._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProjects(
        projects.map((p) =>
          p._id === selectedProject._id ? response.data.project : p
        )
      );
      setSelectedProject(null);
      setProjectFiles([]);
      setProjectFilePreviewUrls([]);
      setEditMode(false);
      setOpen(false);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to delete a project");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (projectId, imageUrl) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to remove images");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`${BASE_URL}/projects/${projectId}/remove-image`, {
        imageUrl,
      });
      setProjects(
        projects.map((p) =>
          p._id === projectId
            ? {
                ...p,
                images: p.images.filter((img) => img !== imageUrl),
              }
            : p
        )
      );
      toast.success("Image removed successfully");
    } catch (error) {
      toast.error("Failed to remove image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (images) => {
    return images?.length ? (images.length / 5) * 100 : 0;
  };

  const openEditDialog = (project) => {
    setSelectedProject(project);
    setProjectFiles([]);
    setProjectFilePreviewUrls([]);
    setEditMode(true);
    setOpen(true);
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Project Overview
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your projects and their assets
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90"
                disabled={!isAuthenticated}
                onClick={() => {
                  setEditMode(false);
                  setSelectedProject(null);
                  setFiles([]);
                  setFilePreviewUrls([]);
                  setNewProject({ name: "", description: "", note: "" });
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editMode ? "Edit Project" : "Create New Project"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Project Name*
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editMode ? selectedProject?.name : newProject.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={
                      editMode
                        ? selectedProject?.description
                        : newProject.description
                    }
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="note" className="text-sm font-medium">
                    Note
                  </Label>
                  <Input
                    id="note"
                    name="note"
                    value={editMode ? selectedProject?.note : newProject.note}
                    onChange={handleChange}
                    placeholder="Additional notes"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-3">
                  <Label className="text-sm font-medium">
                    Project Images (
                    {editMode ? projectFiles.length : files.length}/5)
                  </Label>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 transition-colors",
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300",
                      "flex flex-col items-center justify-center cursor-pointer"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center text-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        {isDragging
                          ? "Drop images here"
                          : "Drag & drop images here or click to browse"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Support for JPG, PNG, GIF (Max 5 images)
                      </p>
                    </div>
                  </div>

                  {/* Preview of selected files */}
                  {(editMode ? projectFilePreviewUrls : filePreviewUrls)
                    .length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {(editMode
                        ? projectFilePreviewUrls
                        : filePreviewUrls
                      ).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="h-20 w-20 rounded-md object-cover border"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Show existing images when editing */}
                  {editMode &&
                    selectedProject?.images &&
                    selectedProject.images.length > 0 && (
                      <>
                        <Label className="text-sm font-medium mt-2">
                          Current Images
                        </Label>
                        <div className="grid grid-cols-5 gap-2">
                          {selectedProject.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Project ${index + 1}`}
                                className="h-20 w-20 rounded-md object-cover border"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-md flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(selectedProject._id, image);
                                  }}
                                  className="bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    if (editMode) {
                      setSelectedProject(null);
                      setEditMode(false);
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editMode ? updateProject : addProject}
                  disabled={loading}
                  className={editMode ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  {loading
                    ? editMode
                      ? "Updating..."
                      : "Creating..."
                    : editMode
                    ? "Update Project"
                    : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Please log in to create or manage projects.
          </div>
        )}

        {loading && projects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="h-40 w-full rounded-none" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-60 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No projects yet
            </h3>
            <p className="text-gray-500 mt-1">
              Get started by creating your first project
            </p>
            {isAuthenticated && (
              <Button
                className="mt-4"
                onClick={() => {
                  setEditMode(false);
                  setSelectedProject(null);
                  setOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Create Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project._id}
                className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="p-0 relative bg-gray-100">
                  {project.images && project.images.length > 0 ? (
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-1 h-48">
                        {project.images.slice(0, 4).map((image, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "relative overflow-hidden",
                              project.images.length === 1 &&
                                "col-span-2 row-span-2",
                              project.images.length === 3 &&
                                idx === 0 &&
                                "row-span-2"
                            )}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`${project.name} image ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {project.images.length > 4 && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                            +{project.images.length - 4} more
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 bg-gray-100">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {project.user?._id === user?._id && (
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-black/20 hover:bg-black/30 text-white rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(project)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit project
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => deleteProject(project._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {project.name}
                    </h3>
                    <CircleProgress
                      percentage={calculateCompletion(project.images)}
                    />
                  </div>

                  {project.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {project.note && (
                    <div className="p-2 bg-amber-50 rounded-md text-sm text-amber-800 mb-3">
                      {project.note}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.images && project.images.length > 0 ? (
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-gray-100">
                          {project.images.length}/5 images
                        </Badge>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-500"
                      >
                        No images
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="px-5 py-3 border-t bg-gray-50 flex justify-between">
                  <div className="text-xs text-gray-500">
                    By {project.user?.username || "Unknown user"}
                  </div>

                  {project.user?._id === user?._id &&
                    project.images &&
                    project.images.length > 0 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                          >
                            Manage Images
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Project Images</DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
                            {project.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative group aspect-square"
                              >
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Project ${index + 1}`}
                                  className="w-full h-full object-cover rounded-md"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-md flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeImage(project._id, image)
                                    }
                                    className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end">
                            <Button
                              variant="outline"
                              onClick={() => openEditDialog(project)}
                            >
                              Add More Images
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

function CircleProgress({ percentage }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const strokeWidth = 3;
  const size = (radius + strokeWidth) * 2;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e6e6e6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={
            percentage < 30
              ? "#f97316"
              : percentage < 70
              ? "#eab308"
              : "#22c55e"
          }
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute text-xs font-medium">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
