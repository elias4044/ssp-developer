import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  Folder,
  GitBranch,
  GitFork,
} from "lucide-react";
import { getDocsIndex, repositoryUrl } from "@/lib/docs";
import { DocSearch } from "@/components/DocSearch";
import { SourceTools } from "@/components/SourceTools";

export default async function HomePage() {
  const index = await getDocsIndex();
  return (
    <main id="main-content">
      <section className="hero frame">
        <div className="hero-copy">
          <h1>
            <span>SchoolSoft+.</span>
            <span>Under the hood.</span>
          </h1>
          <p className="hero-description">
            The developer home for the student-built SchoolSoft dashboard. Read
            the docs, explore the source, and make it your own.
          </p>
          <div className="hero-actions flex flex-wrap items-center gap-7">
            <Link href="/docs" className="primary-button">
              Explore the docs <ArrowRight size={18} />
            </Link>
            <a href={repositoryUrl} className="text-link">
              View source <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="repository-stage" data-ui>
          <div className="repo-heading flex items-center justify-between gap-4">
            <span className="flex items-center gap-3">
              <GitFork size={20} /> elias4044 / schoolsoftplus
            </span>
            <span className="branch flex items-center gap-2">
              <GitBranch size={14} /> main
            </span>
          </div>
          <div className="repo-tree">
            <a href={`${repositoryUrl}/tree/main/app`} className="tree-row">
              <Folder size={18} />
              <span>app</span>
              <span>Application</span>
            </a>
            <a
              href={`${repositoryUrl}/tree/main/components`}
              className="tree-row"
            >
              <Folder size={18} />
              <span>components</span>
              <span>Interface</span>
            </a>
            <a href={`${repositoryUrl}/tree/main/lib`} className="tree-row">
              <Folder size={18} />
              <span>lib</span>
              <span>Behind the scenes</span>
            </a>
            <Link href="/docs" className="tree-row selected">
              <Folder size={18} />
              <span>docs</span>
              <span>
                {index.status === "ready"
                  ? `${index.entries.length} documents`
                  : index.status === "empty"
                    ? "Coming soon"
                    : "Unavailable"}
              </span>
              <ArrowRight size={16} />
            </Link>
            <a
              href={`${repositoryUrl}/blob/main/README.md`}
              className="tree-row"
            >
              <FileText size={18} />
              <span>README.md</span>
              <span>The starting point</span>
            </a>
          </div>
          <div className="repo-note">
            <span className="repo-note-mark">+</span>
            <p>
              A better school day.
              <br />
              <span>And the code behind it.</span>
            </p>
          </div>
        </div>
      </section>
      <section
        className="docs-discovery frame"
        aria-labelledby="documentation-title"
      >
        <div className="section-intro">
          <h2 id="documentation-title">Find your starting point</h2>
          <p>
            Documentation lives alongside the code.
            <br />
            Find a guide and get to the part you need.
          </p>
        </div>
        <DocSearch entries={index.entries} status={index.status} compact />
      </section>
      <section
        className="contribute-section frame"
        aria-labelledby="contribute-title"
      >
        <div className="section-intro">
          <h2 id="contribute-title">Make it your own</h2>
          <p>
            Start with the application.
            <br />
            Keep the reference close.
          </p>
        </div>
        <SourceTools
          status={index.status}
          count={index.entries.length}
          revision={index.revision}
        />
      </section>
      <section className="source-section frame" aria-labelledby="source-title">
        <div>
          <h2 id="source-title">
            Same project.
            <br />
            Open book.
          </h2>
          <p>
            SchoolSoft+ is an independent interface for SchoolSoft, made by a
            student. This is where the implementation becomes something you can
            understand and contribute to.
          </p>
        </div>
        <div className="source-links">
          <a href={repositoryUrl}>
            <span>
              <strong>Explore the repository</strong>
              <span>Read the application behind the interface.</span>
            </span>
          </a>
          <a href={`${repositoryUrl}/new/main/docs`}>
            <span>
              <strong>Help write the docs</strong>
              <span>Documentation belongs in the main project.</span>
            </span>
          </a>
          <a href={`${repositoryUrl}/issues`}>
            <span>
              <strong>Start a conversation</strong>
              <span>Report a problem or suggest what comes next.</span>
            </span>
          </a>
        </div>
      </section>
      <section className="app-invitation frame" aria-labelledby="app-title">
        <div>
          <h2 id="app-title">See the other side</h2>
          <p>The code makes more sense when you have used the app.</p>
        </div>
        <a href="https://ssp.elias4044.com" className="light-button">
          Open SchoolSoft+ <ArrowUpRight size={18} />
        </a>
      </section>
    </main>
  );
}
