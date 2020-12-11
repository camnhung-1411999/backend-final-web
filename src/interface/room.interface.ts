import { ApiProperty } from '@nestjs/swagger';
export class RoomInput {
    @ApiProperty()
    player: string;
}