"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Edit, Monitor } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { EntryForm } from "./entry-form";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent || "");
  const [resumeMode, setResumeMode] = useState("preview");

  const { user } = useUser();

  const {
    control,
    register,
    watch,
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent || initialContent || "");
    }
  }, [formValues, activeTab]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];

    if (contactInfo?.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo?.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo?.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo?.twitter)
      parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length
      ? `## <div align="center">${user?.fullName || ""}</div>

<div align="center">
${parts.join(" | ")}
</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;

    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        {/* ================= FORM TAB ================= */}
        <TabsContent value="edit">
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <Input {...register("contactInfo.email")} placeholder="Email" />
                <Input {...register("contactInfo.mobile")} placeholder="Mobile" />
                <Input
                  {...register("contactInfo.linkedin")}
                  placeholder="LinkedIn URL"
                />
                <Input
                  {...register("contactInfo.twitter")}
                  placeholder="Twitter/X URL"
                />
              </div>
            </div>

            {/* Summary */}
            <Controller
              name="summary"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Professional Summary" />
              )}
            />

            {/* Skills */}
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Skills" />
              )}
            />

            {/* Experience */}
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <EntryForm
                  type="Experience"
                  entries={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Education */}
            <Controller
              name="education"
              control={control}
              render={({ field }) => (
                <EntryForm
                  type="Education"
                  entries={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {/* Projects */}
            <Controller
              name="projects"
              control={control}
              render={({ field }) => (
                <EntryForm
                  type="Project"
                  entries={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </TabsContent>

        {/* ================= PREVIEW TAB ================= */}
        <TabsContent value="preview">
          <Button
            variant="link"
            onClick={() =>
              setResumeMode(resumeMode === "preview" ? "edit" : "preview")
            }
          >
            {resumeMode === "preview" ? (
              <>
                <Edit className="h-4 w-4 mr-1" />
                Edit Markdown
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4 mr-1" />
                Show Preview
              </>
            )}
          </Button>

          {resumeMode !== "preview" && (
            <div className="flex items-center gap-2 border-2 border-yellow-600 text-yellow-600 p-3 rounded">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                Editing markdown may be overwritten by form changes.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
