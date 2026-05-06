const fs = require('fs');
const path = require('path');

const features = [
  'attendance',
  'blacklist',
  'class',
  'dashboard',
  'report',
  'student',
  'subject',
  'user'
];

const appDir = path.join(__dirname, 'src/app');
const componentsDir = path.join(__dirname, 'src/components');

// 1 & 2. Move files
for (const feature of features) {
  const sourceDir = path.join(appDir, feature, '_components');
  const targetDir = path.join(componentsDir, feature);

  if (fs.existsSync(sourceDir)) {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir);
    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);
      
      // Move file
      fs.renameSync(sourceFile, targetFile);
      console.log(`Moved: ${sourceFile} -> ${targetFile}`);

      // Update paths inside the moved file if necessary
      // E.g., if it imported from @/components, it's fine. If it used ../../ it might be broken.
      // Usually these components import from @/components or relative.
      // If it imports from `../`, it might need fixing.
      let content = fs.readFileSync(targetFile, 'utf8');
      
      // Fix import AttendanceTable if we are in attendance-content.tsx
      if (feature === 'attendance' && file === 'attendance-content.tsx') {
        content = content.replace(/@\/components\/attendance\/AttendanceTable/g, './AttendanceTable');
        fs.writeFileSync(targetFile, content, 'utf8');
      }
    }

    // Remove the old _components directory
    fs.rmdirSync(sourceDir);
    console.log(`Removed directory: ${sourceDir}`);
  }
}

// 3 & 4. Update page.tsx imports
for (const feature of features) {
  const pageFile = path.join(appDir, feature, 'page.tsx');
  if (fs.existsSync(pageFile)) {
    let content = fs.readFileSync(pageFile, 'utf8');
    
    // Replace import { FeatureContent } from "./_components/feature-content";
    // with import { FeatureContent } from "@/components/feature/feature-content";
    const regex = /from\s+['"]\.\/_components\/([^'"]+)['"]/g;
    content = content.replace(regex, `from "@/components/${feature}/$1"`);
    
    fs.writeFileSync(pageFile, content, 'utf8');
    console.log(`Updated imports in: ${pageFile}`);
  }
}

// 5. Remove unused pages
const unusedPages = [
  '(home)',
  'charts',
  'forms',
  'pages',
  'tables',
  'ui-elements'
];

for (const p of unusedPages) {
  const dir = path.join(appDir, p);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted unused page directory: ${dir}`);
  }
}

// 6. Remove unused components
const unusedComponents = [
  'Charts',
  'FormElements',
  'Tables',
  'ui-elements'
];

for (const c of unusedComponents) {
  const dir = path.join(componentsDir, c);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`Deleted unused component directory: ${dir}`);
  }
}

// 7. Create root page.tsx redirect
const rootPagePath = path.join(appDir, 'page.tsx');
const rootPageContent = `"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full border-b-2 border-primary p-5"></div>
    </div>
  );
}
`;
fs.writeFileSync(rootPagePath, rootPageContent, 'utf8');
console.log(`Created root redirect page: ${rootPagePath}`);

console.log("Refactoring complete.");
