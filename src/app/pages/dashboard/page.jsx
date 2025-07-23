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
  Clock,
  Calendar,
  User,
  FolderOpen,
  ImageIcon as ImageIconLucide,
  Search,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProjectOverview() {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    note: "",
    duration: "",
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Check if user can edit/delete a project
  const canEditProject = (project) => {
    if (!isAuthenticated || !user) return false;
    return user.role === "admin" || project.user?._id === user._id;
  };

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects based on search and filter criteria
  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          project.duration?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterBy !== "all") {
      filtered = filtered.filter((project) => {
        switch (filterBy) {
          case "completed":
            return project.images?.length >= 5;
          case "in-progress":
            return project.images?.length > 0 && project.images?.length < 5;
          case "empty":
            return !project.images?.length;
          case "my-projects":
            return project.user?._id === user?._id;
          default:
            return true;
        }
      });
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, filterBy, user]);

  // Generate preview URLs for files
  useEffect(() => {
    if (files.length > 0) {
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setFilePreviewUrls(newPreviewUrls);
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
      return () => {
        newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
    }
  }, [projectFiles]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    if (!newProject.description.trim()) {
      toast.error("Project description is required");
      return;
    }
    if (!newProject.duration.trim()) {
      toast.error("Project duration is required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);
      formData.append("note", newProject.note);
      formData.append("duration", newProject.duration);

      files.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post(`${BASE_URL}/projects`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProjects([...projects, response.data.newProject]);
      setNewProject({ name: "", description: "", note: "", duration: "" });
      setFiles([]);
      setFilePreviewUrls([]);
      setOpen(false);
      toast.success("Project created successfully! 🎉");
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
    if (!canEditProject(selectedProject)) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    if (!selectedProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!selectedProject.description.trim()) {
      toast.error("Project description is required");
      return;
    }
    if (!selectedProject.duration.trim()) {
      toast.error("Project duration is required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", selectedProject.name);
      formData.append("description", selectedProject.description);
      formData.append("note", selectedProject.note);
      formData.append("duration", selectedProject.duration);

      projectFiles.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.put(
        `${BASE_URL}/projects/${selectedProject._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      toast.success("Project updated successfully! ✨");
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

    const project = projects.find((p) => p._id === projectId);
    if (!canEditProject(project)) {
      toast.error("You don't have permission to delete this project");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${BASE_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

    const project = projects.find((p) => p._id === projectId);
    if (!canEditProject(project)) {
      toast.error("You don't have permission to edit this project");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${BASE_URL}/projects/${projectId}/remove-image`,
        { imageUrl },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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
    if (!canEditProject(project)) {
      toast.error("You don't have permission to edit this project");
      return;
    }
    setSelectedProject(project);
    setProjectFiles([]);
    setProjectFilePreviewUrls([]);
    setEditMode(true);
    setOpen(true);
  };

  const resetForm = () => {
    setEditMode(false);
    setSelectedProject(null);
    setFiles([]);
    setFilePreviewUrls([]);
    setProjectFiles([]);
    setProjectFilePreviewUrls([]);
    setNewProject({ name: "", description: "", note: "", duration: "" });
  };

  const getProjectStats = () => {
    const total = projects.length;
    const completed = projects.filter((p) => p.images?.length >= 5).length;
    const inProgress = projects.filter(
      (p) => p.images?.length > 0 && p.images?.length < 5
    ).length;
    const empty = projects.filter((p) => !p.images?.length).length;
    const myProjects = projects.filter((p) => p.user?._id === user?._id).length;

    return { total, completed, inProgress, empty, myProjects };
  };

  const stats = getProjectStats();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-white" />
                  </div>
                  Project Overview
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage your projects and their assets efficiently
                  {user?.role === "admin" && (
                    <span className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm rounded-full">
                      Admin View - All Projects
                    </span>
                  )}
                </p>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={!isAuthenticated}
                    onClick={resetForm}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                      {editMode ? "Edit Project" : "Create New Project"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Project Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={
                            editMode
                              ? selectedProject?.name || ""
                              : newProject.name
                          }
                          onChange={handleChange}
                          placeholder="Enter project name"
                          className="h-11"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor="duration"
                          className="text-sm font-medium"
                        >
                          Duration *
                        </Label>
                        <Input
                          id="duration"
                          name="duration"
                          value={
                            editMode
                              ? selectedProject?.duration || ""
                              : newProject.duration
                          }
                          onChange={handleChange}
                          placeholder="e.g., 2 weeks, 1 month"
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={
                          editMode
                            ? selectedProject?.description || ""
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
                        Additional Notes
                      </Label>
                      <Input
                        id="note"
                        name="note"
                        value={
                          editMode
                            ? selectedProject?.note || ""
                            : newProject.note
                        }
                        onChange={handleChange}
                        placeholder="Any additional notes or comments"
                        className="h-11"
                      />
                    </div>

                    <div className="grid gap-3">
                      <Label className="text-sm font-medium">
                        Project Images (
                        {editMode ? projectFiles.length : files.length}/5)
                      </Label>
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-8 transition-colors",
                          isDragging
                            ? "border-purple-500 bg-purple-50"
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
                          <Upload className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {isDragging
                              ? "Drop images here"
                              : "Drag & drop images here or click to browse"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Support for JPG, PNG, GIF (Max 5 images)
                          </p>
                        </div>
                      </div>

                      {/* Preview of selected files */}
                      {(editMode ? projectFilePreviewUrls : filePreviewUrls)
                        .length > 0 && (
                        <div className="grid grid-cols-5 gap-3 mt-4">
                          {(editMode
                            ? projectFilePreviewUrls
                            : filePreviewUrls
                          ).map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                            <Label className="text-sm font-medium mt-4">
                              Current Images ({selectedProject.images.length})
                            </Label>
                            <div className="grid grid-cols-5 gap-3">
                              {selectedProject.images.map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Project ${index + 1}`}
                                    className="h-20 w-20 rounded-lg object-cover border-2 border-gray-200"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(selectedProject._id, image);
                                      }}
                                      className="bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        resetForm();
                      }}
                      className="h-11"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editMode ? updateProject : addProject}
                      disabled={loading}
                      className={cn(
                        "h-11",
                        editMode
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      )}
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

            {/* Search and Filter Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search projects by name, description, or duration..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-white shadow-sm border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40 h-12">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="empty">No Images</SelectItem>
                    {user && (
                      <SelectItem value="my-projects">My Projects</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>


          {/* Authentication Warning */}
          {!isAuthenticated && (
            <div className="mb-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">
                    Authentication Required
                  </h3>
                  <p className="text-amber-700">
                    Please log in to create or manage projects.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Projects Display */}
          {loading && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden shadow-lg border-0">
                  <CardHeader className="p-0">
                    <Skeleton className="h-48 w-full rounded-none" />
                  </CardHeader>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {searchTerm || filterBy !== "all"
                    ? "No projects found"
                    : "No projects yet"}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filterBy !== "all"
                    ? "No projects match your search criteria. Try adjusting your filters."
                    : "Get started by creating your first project to begin managing your work."}
                </p>
                {isAuthenticated && !searchTerm && filterBy === "all" && (
                  <Button
                    onClick={() => {
                      resetForm();
                      setOpen(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create First Project
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card
                  key={project._id}
                  className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white"
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
                      <div className="flex items-center justify-center h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    {canEditProject(project) && (
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-black/20 hover:bg-black/30 text-white rounded-full backdrop-blur-sm"
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
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">
                          {project.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {project.duration}
                          </span>
                        </div>
                      </div>
                      <CircleProgress
                        percentage={calculateCompletion(project.images)}
                      />
                    </div>

                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {project.note && (
                      <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800 mb-4 border border-amber-200">
                        <strong>Note:</strong> {project.note}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          project.images?.length >= 5
                            ? "bg-green-100 text-green-800 border-green-200"
                            : project.images?.length > 0
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        )}
                      >
                        {project.images?.length || 0}/5 images
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {project.projectID}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-1" />
                      <span>{project.user?.username || "Unknown user"}</span>
                      {user?.role === "admin" &&
                        project.user?._id !== user._id && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Other User
                          </Badge>
                        )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function CircleProgress({ percentage }) {
  const radius = 18;
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
          stroke="#e5e7eb"
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
      <div className="absolute text-xs font-semibold">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
