use anchor_lang::prelude::*;

declare_id!("Hy7s8s286KFx1fQwVuBntSxsWp7Cr8EAtMcoG4y7VZ7N");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count -= 1;
        Ok(())
    }

    pub fn reset(ctx: Context<Reset>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }
}

#[account]
pub struct Counter {
    count: i32,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer=signer, space=32)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub caller: Signer<'info>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub caller: Signer<'info>,
}

#[derive(Accounts)]
pub struct Reset<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub caller: Signer<'info>,
}
