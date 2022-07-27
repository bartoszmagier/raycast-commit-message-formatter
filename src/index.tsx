import { List, ActionPanel, Action, Icon, Detail } from "@raycast/api";
import { ReactElement, useEffect, useState } from "react";

type BranchMatch = {
  type?: string;
  ticketNo?: string;
  message?: string;
};

type Result = {
  text: string;
  type?: string;
  ticketNo?: string;
  message?: string;
  icon?: Icon;
};

export default function Command(): ReactElement {
  const [branchName, setBranchName] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [isShowingDetail, setIsShowingDetail] = useState(false);

  useEffect(() => {
    if (branchName) {
      const regexp = /^(?<type>([^/])+)\/(?<ticketNo>[A-Z]{2,}-([^-])+)-(?<message>.*)/;
      const groups = branchName.match(regexp)?.groups as BranchMatch;

      setResults([]);

      if (groups && groups.type && groups.ticketNo && groups.message) {
        const { type, ticketNo, message } = groups;

        setResults([
          {
            text: `${type}(${ticketNo}): ${message.replaceAll("-", " ")}`,
            type,
            ticketNo,
            message: message.replaceAll("-", " "),
          },
          {
            text: `${ticketNo} - ${message.replaceAll("-", " ")}`,
            type,
            ticketNo,
            message: message.replaceAll("-", " "),
          },
          {
            text: `[${ticketNo}] ${message.replaceAll("-", " ")}`,
            type,
            ticketNo,
            message: message.replaceAll("-", " "),
          },
        ]);
      } else {
        setError("Please use correct branch format");
      }
    }
  }, [branchName]);

  return (
    <List
      navigationTitle="Enter branch name"
      searchBarPlaceholder="feature/TICKET-123-feature-description"
      onSearchTextChange={setBranchName}
      isShowingDetail={isShowingDetail}
      throttle
    >
      {results.length === 0 ? (
        <List.EmptyView
          icon={error ? Icon.ExclamationMark : null}
          title={error ? error : "Please enter the branch name"}
          description="Format: feature/TICKET-123-feature-description"
        />
      ) : (
        results.map((r, index) => {
          return (
            <List.Item
              key={index}
              icon={r.icon}
              title={r.text}
              detail={
                <List.Item.Detail
                  markdown={r.text}
                  metadata={
                    <Detail.Metadata>
                      <Detail.Metadata.Label title="Branch Type" text={r.type} />
                      <Detail.Metadata.Label title="Ticket Number" text={r.ticketNo} />
                      <Detail.Metadata.Label title="Message" text={r.message} />
                    </Detail.Metadata>
                  }
                />
              }
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <Action.CopyToClipboard title="Copy" content={r.text} />
                    <Action
                      title="Show Details"
                      icon={Icon.Text}
                      onAction={() => setIsShowingDetail(!isShowingDetail)}
                    />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            ></List.Item>
          );
        })
      )}
    </List>
  );
}
