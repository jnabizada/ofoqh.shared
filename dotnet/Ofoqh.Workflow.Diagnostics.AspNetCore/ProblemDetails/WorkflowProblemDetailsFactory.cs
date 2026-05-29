using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Ofoqh.Workflow.Diagnostics.Abstractions;
using Ofoqh.Workflow.Diagnostics.ProblemDetails;

namespace Ofoqh.Workflow.Diagnostics.AspNetCore.ProblemDetails;

public static class WorkflowProblemDetailsFactory
{
    public static Microsoft.AspNetCore.Mvc.ProblemDetails CreateDependencyFailure(
        HttpContext httpContext,
        string title,
        string attemptedAction,
        IDownstreamDependencyException exception
        )
    {
        var statusCode = exception.IsTimeout
            ? StatusCodes.Status504GatewayTimeout
            : StatusCodes.Status502BadGateway;

        var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Title = title,
            Detail = BuildDependencyFailureDetail(attemptedAction, exception),
            Status = statusCode,
            Type = $"https://httpstatuses.com/{statusCode}",
            Instance = httpContext.Request.Path
        };

        problem.Extensions["traceId"] = httpContext.TraceIdentifier;
        problem.Extensions[WorkflowProblemExtensions.DownstreamService] = exception.DependencyName;
        problem.Extensions[WorkflowProblemExtensions.DownstreamOperation] = exception.Operation;
        problem.Extensions[WorkflowProblemExtensions.FailureChain] = exception.FailureChain;

        return problem;
    }

    private static string BuildDependencyFailureDetail(
        string attemptedAction,
        IDownstreamDependencyException exception
        )
    {
        var exceptionMessage = exception is Exception actualException
            ? actualException.Message
            : $"{exception.DependencyName} failed during {exception.Operation}.";
        var detail = $"Unable to {attemptedAction} because {exceptionMessage}";
        if (exception.StatusCode.HasValue)
        {
            detail += $" Downstream status: {exception.StatusCode.Value}.";
        }

        var innerMessage = exception is Exception wrappedException
            ? wrappedException.InnerException?.Message
            : null;
        if (!string.IsNullOrWhiteSpace(innerMessage) &&
            !detail.Contains(innerMessage, StringComparison.Ordinal))
        {
            detail += $" Inner error: {innerMessage}";
        }

        return detail;
    }
}
