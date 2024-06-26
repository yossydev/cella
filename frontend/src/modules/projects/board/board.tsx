import { Fragment, type LegacyRef, useEffect, useState } from 'react';
import { useBreakpoints } from '~/hooks/use-breakpoints';
import { useMeasure } from '~/hooks/use-measure';
import { useWorkspaceContext } from '~/modules/workspaces/workspace-context';
import type { Project } from '~/types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../ui/resizable';
import { BoardColumn } from './board-column';
import { Bird, Redo } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ContentPlaceholder from '~/modules/common/content-placeholder';
const PANEL_MIN_WIDTH = 300;
// Allow resizing of panels
const EMPTY_SPACE_WIDTH = 300;

function getScrollerWidth(containerWidth: number, projectsLength: number) {
  if (containerWidth === 0) return '100%';
  return containerWidth / projectsLength > PANEL_MIN_WIDTH ? '100%' : projectsLength * PANEL_MIN_WIDTH + EMPTY_SPACE_WIDTH;
}

function BoardDesktop({
  workspaceId,
  projects,
}: {
  projects: Project[];
  workspaceId: string;
}) {
  const { ref, bounds } = useMeasure();
  const scrollerWidth = getScrollerWidth(bounds.width, projects.length);
  const panelMinSize = typeof scrollerWidth === 'number' ? (PANEL_MIN_WIDTH / scrollerWidth) * 100 : 100 / (projects.length + 1); // + 1 so that the panel can be resized to be bigger or smaller

  return (
    <div className="transition sm:h-[calc(100vh-64px)] md:h-[calc(100vh-78px)] overflow-x-auto" ref={ref as LegacyRef<HTMLDivElement>}>
      <div className="h-[inherit]" style={{ width: scrollerWidth }}>
        <ResizablePanelGroup direction="horizontal" className="flex gap-2 group/board" id="project-panels" autoSaveId={workspaceId}>
          {projects.map((project, index) => (
            <Fragment key={project.id}>
              <ResizablePanel key={project.id} id={project.id} order={index} minSize={panelMinSize}>
                <BoardColumn key={project.id} project={project} />
              </ResizablePanel>
              {projects.length > index + 1 && (
                <ResizableHandle className="w-[6px] rounded border border-background -mx-[7px] bg-transparent hover:bg-primary/50 data-[resize-handle-state=drag]:bg-primary transition-all" />
              )}
            </Fragment>
          ))}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default function Board() {
  const { workspace, projects } = useWorkspaceContext(({ workspace, projects }) => ({
    workspace,
    projects,
  }));
  const { t } = useTranslation();
  const [mappedProjects, setMappedProjects] = useState<Project[]>(
    projects.sort((a, b) => {
      if (a.membership === null || b.membership === null) return 0;
      return a.membership.order - b.membership.order;
    }),
  );
  const isDesktopLayout = useBreakpoints('min', 'sm');

  useEffect(() => {
    setMappedProjects(
      projects.sort((a, b) => {
        if (a.membership === null || b.membership === null) return 0;
        return a.membership.order - b.membership.order;
      }),
    );
  }, [projects]);

  if (!mappedProjects.length) {
    return (
      <ContentPlaceholder
        className=" h-[calc(100vh-64px-64px)] sm:h-[calc(100vh-78px)]"
        Icon={Bird}
        title={t('common:no_resource_yet', { resource: t('common:projects').toLowerCase() })}
        text={
          <>
            <Redo
              size={200}
              strokeWidth={0.2}
              className="max-md:hidden absolute scale-x-0 scale-y-75 -rotate-180 text-primary top-4 left-4 translate-y-20 opacity-0 duration-500 delay-500 transition-all group-hover/workspace:opacity-100 group-hover/workspace:scale-x-100 group-hover/workspace:translate-y-0 group-hover/workspace:rotate-[-130deg]"
            />
            <p className="inline-flex gap-1 opacity-0 duration-500 transition-opacity group-hover/workspace:opacity-100">
              <span>{t('common:click')}</span>
              <span className="text-primary">{`+ ${t('common:add')}`}</span>
              <span>{t('common:no_projects.text')}</span>
            </p>
          </>
        }
      />
    );
  }

  // On desktop we render all columns in a board
  if (isDesktopLayout) return <BoardDesktop projects={mappedProjects} workspaceId={workspace.id} />;

  // On mobile we just render one column
  return (
    <div className="flex flex-col gap-4">
      {mappedProjects.map((project) => (
        <BoardColumn key={project.id} project={project} />
      ))}
    </div>
  );
}
