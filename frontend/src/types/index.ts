import type { config } from 'config';
import type { InferRequestType, InferResponseType } from 'hono/client';
import type { apiClient } from '~/api';
import type { Session } from '~/modules/users/user-settings';

export enum UploadType {
  Personal,
  Organization,
}

export interface UploadParams {
  public: boolean;
  organizationId?: string;
}

export type DraggableItemData<T> = {
  type: string;
  item: T;
  itemType: Entity;
  dragItem: true;
  order: number;
};

export type Entity = (typeof config.entityTypes)[number];
export type ContextEntity = (typeof config.contextEntityTypes)[number];

export type RequestProp = InferRequestType<typeof apiClient.requests.$post>['json'];

export type User = Extract<InferResponseType<(typeof apiClient.users)[':idOrSlug']['$get']>, { data: unknown }>['data'];

export type MeUser = User & { electricJWTToken: string; sessions: Session[] };

export type Organization = Extract<InferResponseType<(typeof apiClient.organizations)['$get']>, { data: unknown }>['data']['items'][number];

export type Request = Extract<InferResponseType<(typeof apiClient.requests)['$get']>, { data: unknown }>['data']['items'][number];

export type Workspace = Extract<InferResponseType<(typeof apiClient.workspaces)[':idOrSlug']['$get']>, { data: unknown }>['data'];

type EntityPageProps = 'id' | 'slug' | 'entity' | 'name' | 'createdAt' | 'thumbnailUrl' | 'bannerUrl' | 'organizationId';
type BaseEntityPage = Pick<Project, EntityPageProps>;

export type EntityPage = Omit<BaseEntityPage, 'organizationId'> & {
  organizationId: Project['organizationId'] | null | undefined;
};

export type Project = Extract<InferResponseType<(typeof apiClient.projects)['$get']>, { data: unknown }>['data']['items'][number];

export type Member = Extract<InferResponseType<(typeof apiClient.members)['$get']>, { data: unknown }>['data']['items'][number];

export type Membership = Extract<InferResponseType<(typeof apiClient.memberships)[':id']['$put']>, { data: unknown }>['data'];

export type UserMenu = Extract<InferResponseType<(typeof apiClient.me.menu)['$get']>, { data: unknown }>['data'];

export type UserMenuItem = NonNullable<
  Extract<InferResponseType<(typeof apiClient.me.menu)['$get']>, { data: unknown }>['data']['workspaces'][number]
>;
