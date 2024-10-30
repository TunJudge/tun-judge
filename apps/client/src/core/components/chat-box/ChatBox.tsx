import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Flex, Sheet } from 'tw-react-components';

import { Prisma } from '@prisma/client';

import { useActiveContest, useAuthContext } from '@core/contexts';
import { useCreateManyClarificationSeen, useFindFirstClarification } from '@core/queries';

import { ChatBoxHeader } from './ChatBoxHeader';
import { ChatBoxInput } from './ChatBoxInput';
import { ChatBoxMessageList } from './ChatBoxMessageList';

export type Clarification = Prisma.ClarificationGetPayload<{
  include: {
    problem: { include: { problem: true } };
    messages: { include: { sentBy: true; seenBy: true } };
  };
}>;

type Props = {
  clarificationId?: number;
};

export const ChatBox: FC<Props> = ({ clarificationId }) => {
  const { profile } = useAuthContext();
  const { currentContest } = useActiveContest();
  const isUserJury = profile?.roleName === 'jury';

  const { data: clarification, isLoading } = useFindFirstClarification({
    where: { id: clarificationId },
    include: {
      problem: { include: { problem: true } },
      messages: { include: { sentBy: true, seenBy: true } },
    },
  });

  const form = useForm<Clarification>({
    defaultValues: { general: true },
  });

  const { mutateAsync: setClarificationMessageAsSeen, isPending } =
    useCreateManyClarificationSeen();

  useEffect(() => {
    form.reset({ general: true });
  }, [form, clarificationId]);

  useEffect(() => {
    if (!clarification || !profile || isPending || isLoading) return;

    const unseenMessages = clarification.messages.filter(
      (message) =>
        message.sentById !== profile.id && !message.seenBy.some((u) => u.userId === profile.id),
    );

    if (!unseenMessages.length) return;

    setClarificationMessageAsSeen({
      data: unseenMessages.map((message) => ({
        userId: profile.id,
        messageId: message.id,
      })),
      skipDuplicates: true,
    });
  }, [
    profile,
    isPending,
    isLoading,
    isUserJury,
    currentContest,
    setClarificationMessageAsSeen,
    clarification,
  ]);

  return (
    <Flex direction="column" fullHeight>
      <ChatBoxHeader form={form} clarification={clarification} />
      <ChatBoxMessageList clarification={clarification} />
      {(clarification?.teamId || profile?.teamId || isUserJury) && (
        <ChatBoxInput form={form} clarification={clarification} />
      )}
    </Flex>
  );
};

type ChatBoxDialogProps = {
  clarificationId?: number;
  onClose: () => void;
};

export const ChatBoxDialog: FC<ChatBoxDialogProps> = ({ clarificationId, onClose }) => (
  <Sheet open={!!clarificationId} onOpenChange={(value) => !value && onClose()}>
    <Sheet.Content className="!max-w-7xl">
      <Sheet.Title className="hidden" />
      <ChatBox clarificationId={clarificationId} />
    </Sheet.Content>
  </Sheet>
);
