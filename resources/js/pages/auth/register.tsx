import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { useState } from 'react';

export default function Register() {
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const stepTitles = [
        "Hotel Profile",
        "Account Details",
        "Security"
    ];

    return (
        <AuthLayout
            title={stepTitles[step - 1]}
            description={`Step ${step} of ${totalSteps}: Enter your ${stepTitles[step - 1].toLowerCase()}`}
        >
            <Head title="Register" />

            {/* Progress Indicator */}
            <div className="mb-8 flex gap-2">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'
                            }`}
                    />
                ))}
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* Step 1: Hotel Profile */}
                            <div className={step !== 1 ? 'hidden' : 'grid gap-6'}>
                                <div className="grid gap-2">
                                    <Label htmlFor="hotel_name">Hotel Name</Label>
                                    <Input
                                        id="hotel_name"
                                        type="text"
                                        required
                                        autoFocus={step === 1}
                                        tabIndex={1}
                                        name="hotel_name"
                                        placeholder="Hotel name"
                                    />
                                    <InputError message={errors.hotel_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hotel_phone">Hotel Phone</Label>
                                    <Input
                                        id="hotel_phone"
                                        type="tel"
                                        required
                                        tabIndex={2}
                                        name="hotel_phone"
                                        placeholder="+234..."
                                    />
                                    <InputError message={errors.hotel_phone} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hotel_address">Hotel Address</Label>
                                    <Input
                                        id="hotel_address"
                                        type="text"
                                        required
                                        tabIndex={3}
                                        name="hotel_address"
                                        placeholder="Full address"
                                    />
                                    <InputError message={errors.hotel_address} />
                                </div>

                                <Button
                                    type="button"
                                    className="mt-2 w-full"
                                    tabIndex={4}
                                    onClick={nextStep}
                                >
                                    Next: Account Details
                                </Button>
                            </div>

                            {/* Step 2: Account Details */}
                            <div className={step !== 2 ? 'hidden' : 'grid gap-6'}>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Your Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus={step === 2}
                                        tabIndex={1}
                                        name="name"
                                        placeholder="Full name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="email@example.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        tabIndex={4}
                                        onClick={prevStep}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        tabIndex={3}
                                        onClick={nextStep}
                                    >
                                        Next: Security
                                    </Button>
                                </div>
                            </div>

                            {/* Step 3: Security */}
                            <div className={step !== 3 ? 'hidden' : 'grid gap-6'}>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        autoFocus={step === 3}
                                        tabIndex={1}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirm password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                <div className="flex gap-4 mt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        tabIndex={4}
                                        onClick={prevStep}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        tabIndex={3}
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner />}
                                        Create account
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={10}>
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
