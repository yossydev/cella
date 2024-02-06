import { useTranslation } from 'react-i18next';
import { deleteOrganization } from '~/api/organizations';
import { Organization } from '~/types';

import { toast } from 'sonner';
import { DeleteForm } from '~/components/delete-form';
import { dialog } from '~/components/dialoger/state';
import { useApiWrapper } from '~/hooks/use-api-wrapper';

interface Props {
  organization: Organization;
  callback?: (organization: Organization) => void;
  dialog?: boolean;
}

const DeleteOrganization = ({ organization, callback, dialog: isDialog }: Props) => {
  const { t } = useTranslation();
  const [apiWrapper, pending] = useApiWrapper();

  const onDelete = () => {
    apiWrapper(
      () => deleteOrganization(organization.id),
      () => {
        callback?.(organization);

        if (isDialog) {
          dialog.remove();
        }

        toast.success(
          t('success.delete_organization', {
            defaultValue: 'Organization deleted',
          }),
        );
      },
    );
  };

  return <DeleteForm onDelete={onDelete} onCancel={() => dialog.remove()} pending={pending} />;
};

export default DeleteOrganization;
