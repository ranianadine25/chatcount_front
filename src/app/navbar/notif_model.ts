
export class Notification {
    _id: string | undefined;
    sender: { name: string, avatar: string } | null | undefined;
    message: string | undefined;
    creation_date: Date | undefined;
    seen: boolean | undefined;
}
