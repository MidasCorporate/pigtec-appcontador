import { CardFarms } from "./card-farms";

interface FarmProps {
  farms?: {
    id: string;
    name: string;
    nickname: string;
    config_id: string;
    producer_id: string;
  }[];
}

export function Farm({ farms }: FarmProps) {
  return (
    <>
      {farms?.map((farm) => (
        <CardFarms nickname={farm.nickname} title={farm.name} />
      ))}

    </>

  )
}