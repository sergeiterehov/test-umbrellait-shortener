import {Column, Entity, PrimaryColumn} from "typeorm";

/**
 * Main link model
 */
@Entity()
export class Link {
    /**
     * String identifier, up to 32 chars
     */
    @PrimaryColumn()
    public id: string;

    /**
     * Date and time of creation current link
     */
    @Column()
    public createdAt: Date;

    /**
     * The source link
     */
    @Column()
    public sourceLink: string;

    /**
     * Counter: amount of referrals
     */
    @Column()
    public amountOpen: number;
}
