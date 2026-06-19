import type {
  BackendProfile,
  UpdateProfileFormValues,
  UpdateProfilePayload,
  UserProfile,
} from "../types";

const optionalString = (value?: string | null) => {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
};

export const mapBackendProfileToUserProfile = (
  profile: BackendProfile
): UserProfile => ({
  id: profile.id,
  email: profile.email,
  name: profile.name,
  avatarUrl: optionalString(profile.avatarUrl),
  role: profile.role,
  status: profile.status,
  createdAt: profile.createdAt,
});

export const buildUpdateProfilePayload = (
  values: UpdateProfileFormValues
): UpdateProfilePayload => {
  const avatarUrl = optionalString(values.avatarUrl);

  return {
    name: values.name.trim(),
    ...(avatarUrl ? { avatarUrl } : {}),
  };
};

export const areProfilesEqual = (
  current?: UserProfile | null,
  next?: UserProfile | null
) => {
  if (!current || !next) {
    return current === next;
  }

  return (
    current.id === next.id &&
    current.email === next.email &&
    current.name === next.name &&
    current.avatarUrl === next.avatarUrl &&
    current.role === next.role &&
    current.status === next.status &&
    current.createdAt === next.createdAt
  );
};
