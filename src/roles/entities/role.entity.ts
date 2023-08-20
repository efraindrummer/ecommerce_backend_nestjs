import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";
import { User } from '../../users/user.entity';

@Entity({name: 'roles'})
export class Role {

    @PrimaryColumn()
    id: string;

    @Column({unique: true})
    name: string;

    @Column()
    image: string;

    @Column()
    route: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[]

}
